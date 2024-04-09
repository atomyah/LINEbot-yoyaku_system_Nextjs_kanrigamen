"use client"

import React, { useRef } from 'react'
import Link from 'next/link';
//import { Client } from 'pg';
import { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin, { DateClickArg, Draggable, DropArg,  } from '@fullcalendar/interaction';
import jaLocale from '@fullcalendar/core/locales/ja';
import { EventContentArg, EventInput, EventClickArg } from '@fullcalendar/common';

import styles from './Calender.module.css';


interface Reservations {
    id: number;
    line_uid: string;
    name: string;
    scheduledate: string;
    starttime: Date;
    endtime: Date;
    menu: string;
}

export default function Calender() {
    const [reservations, setReservations] = useState<Reservations[]>([]);


    useEffect(() => {
        fetchReservations();
      }, []);
    
      // api/reservations APIから予約データをフェッチ
      const fetchReservations = async () => {
        try {
          const response = await fetch(`/api/reservations/readall`, { cache: "no-store"});
          const data = await response.json();
          setReservations(data);
          console.log('reservationsは(Calenderコンポーネントの中)：', reservations);
        } catch (error) {
          console.error('Error fetching reservations:', error);
        }
      };
    
    
      // menu番号をカタカナに. グローバル変数．
      const MENU_INIT = ['ボデ','ホリ','パー'];
    
      // FullCalenderで使うeventsを作成．mapで予約データベースreservationsテーブルのデータをすべて取り出して返す．
      const events = reservations.map(event => {
        const menuKana = MENU_INIT[Number(event.menu)];
        return {
          id: `${event.id}`,
          title: `${event.name} ${menuKana}`, // 修正: reservation.menuの代わりにmenuKanaを使用
          start: new Date(Number(event.starttime)),
          end: new Date(Number(event.endtime)),
        };
      });
    
      // カスタムイベントコンテンツ関数（eventContent={renderEventContent}で使用）．フォントサイズ、時間の表示方法等を調整．
      const renderEventContent = (eventInfo: EventInput) => {
        const { event } = eventInfo;                  // ← 大事．これが無かったので「削除」機能を実装するのに大変苦労した．
        if (!event.start || !event.end) return null; // ここでnullチェックを追加
        const startTime = event.start.toLocaleTimeString([], { hour: '2-digit' });
        const endTime = event.end.toLocaleTimeString([], { hour: '2-digit' });
      
        console.log('△１．renderEventContentの中のevent：', event)

        const handleDeleteClick = () => {
          const confirmDelete = window.confirm('この予約を削除しますか?');
          if (confirmDelete) {
            handleEventDelete(event);
          }
        };
      
        return (
          <div style={{ fontSize: '11px' }}>
            <div>{/* {event.id} */} {startTime} {event.title}</div>
            <button className={styles.buttonStyle} onClick={handleDeleteClick}>削除</button>
          </div>
        );
      }
    
      // 上記<button>をクリックすると呼び出され該当予約を削除．
      const handleEventDelete = async (event: EventInput) => {
        try {
          // イベントIDを取得する (IDがある場合)
          console.log('△２．handleEventDeleteの中のreservation：', event)

          const eventId = event.id;

          console.log('△３．handleEventDeleteの中のeventId：', eventId)
      
          // APIリクエストを送信して予約データを削除する
          const response = await fetch(`/api/reservations/${eventId}`, {
            method: 'DELETE',
          });
      
          // 削除が成功した場合は予約データを更新する
          if (response.ok) {
            // 予約データから削除したイベントを除外する
            const updatedReservations = reservations.filter(r => Number(r.id) !== Number(eventId));
            setReservations(updatedReservations);
          } else {
            console.error('Failed to delete reservation');
          }
        } catch (error) {
          console.error('Error deleting reservation:', error);
        }
      }

    
  return (
    <div>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin]}
          locale={jaLocale}
          initialView="timeGridWeek"
          //dateClick={handleDateClick}
          events={events}
          eventContent={renderEventContent} // カスタムイベントコンテンツ関数を渡す
          //eventClick={(args:any)=>handleEventClick}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay' // 時間枠ビューを追加
          }}  
        />

    </div>
  )
}



