"use client"

import Link from 'next/link';
import styles from './page.module.css';
//import { Client } from 'pg';
import { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin, { DateClickArg, Draggable, DropArg,  } from '@fullcalendar/interaction';
import jaLocale from '@fullcalendar/core/locales/ja';
import { EventContentArg, EventInput, EventClickArg } from '@fullcalendar/common';
import Modal from 'react-modal';

import Header from './components/Header';
import Calender from './components/Calender';


export default function HomePage() {

  return (
    <>
    <Header /> {/* ヘッダーナビゲーション */}

    <main className={styles.main}>
      <div className={styles.container}>
        <Calender />
      </div>
    </main>
    </>
  );
}