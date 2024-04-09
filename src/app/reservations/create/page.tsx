"use client"

import Header from '@/app/components/Header';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import DateTimePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import styles from './page.module.css';

// フォーム入力データの型
type formData = {
    line_uid: string,
    name: string,
    scheduledate: Date | null, // Date オブジェクト → 文字列にしたい
    starttime: Date | null, // Date オブジェクト
    endtime: Date | null, // Date オブジェクト
    menu: string,
};


// フォームの初期値
const defaultValue: formData = {
    line_uid: '',
    name: '',
    scheduledate: null, // Date オブジェクト → 文字列にしたい
    starttime: null, // Date オブジェクト → UNIXタイムスタンプ型にしたい
    endtime: null, // Date オブジェクト → UNIXタイムスタンプ型にしたい
    menu: ''
};

const CreateReservation: React.FC = () => {
  const router = useRouter();
    
  const [formData, setFormData] = useState(defaultValue);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Dateピッカー、Timeピッカーを使うフォーム要素のonChangeで使う関数．例：onChange={(date: Date) => handleDateChange(date, 'starttime')}

  // starttimeとendtimeには、UNIXタイムではなく、選択された日時のDateオブジェクトが格納される（例：Tue Apr 25 2023 10:00:00 GMT+0900 (日本標準時)）
  // これをそのままAPIに送信すると、API側ではDateオブジェクトとして受け取ることができる．が、Postgresのtimespamp型に格納するためにはこのDateオブジェクトを
  // ISO形式の文字列に変換する．（例：const startTimeString = formData.starttime.toISOString(); // 結果: "2023-04-25T01:00:00.000Z"）
  // しかし、よくわからないが、PostgreSQLの starttime と endtime カラムに13桁のUNIXタイムスタンプ値を格納したい場合は以下のように
  // const unixTimestamp = date.getTime(); で良いようだ．

  // setFormData({ ...formData, [name]: unixTimestamp })とした場合、formDataの値が古い値を参照してしまう可能性がある．
  // これを防ぐために、状態更新関数にコールバック関数を渡すのがベストプラクティスとされている．
  // コールバック関数の引数prevStateには、状態更新直前の状態値が渡され...prevStateと展開することで最新の状態から新しい状態を生成できる．
  // つまり、setFormData((prevState) => ({ ...prevState, [name]: date}))は、「前の状態から新しい状態を生成する」という意味になる．

  // 以上のstarttime,endtimeをUNIXタイムスタンプ型に、scheduledateを文字列に、という処理をhandleDateChange()で行うとエラー、エラー、エラー…
  // handleSubmit関数の中でAPIを叩く前に処理するようにした．
  const handleDateChange = (date: Date | null, name: string) => {
    setFormData((prevState) => ({
      ...prevState,
      [name]: date
    }));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('△handleSubmitその１：', formData)

    try {
      // APIを叩く前にstarttime,endtimeをUNIXタイムスタンプ型に、scheduledateを文字列に変換．
      const formDataToSubmit = {
        ...formData,
        starttime: formData.starttime ? formData.starttime.getTime() : null,
        endtime: formData.endtime ? formData.endtime.getTime() : null,
        scheduledate: formData.scheduledate ? formData.scheduledate.toISOString().split('T')[0] : null,
      };
      console.log('△handleSubmitその２：', formDataToSubmit);

      const response = await fetch('/api/reservations/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formDataToSubmit) // ← formDataではなく返還後のformDataToSubmitをAPIに送っている．
      });
      const data = await response.json();
      console.log('△handleSubmitその３：', data); // 出力→ {message: 'APIにて予約追加成功'}． api/create.tsからres.status(200).json({ message: "APIにて予約追加成功" });で返されている．

      router.push('/');

    } catch(error) {
      console.error('クライアントで予約追加失敗:', error);
    }
  };

  return (
    <>
    <Header />
     <main className={styles.main}>
	    <h3 className={styles.title}>予約追加</h3>
            <form onSubmit={handleSubmit}>
              {/* フォームフィールドの定義 */}
              <div className="input_Line_id">
                  <label className={styles.label}>ラインIDか電話番号</label>
                  <input
                      className={styles.inputField}
                      type="text"
                      name="line_uid"
                      placeholder="ラインIDか電話番号"
                      value={formData.line_uid}
                      onChange={handleChange}
                  />
              </div>
              <div className="input_name">
                  <label className={styles.label}>名前</label>                
                  <input
                      className={styles.inputField}
                      type="text"
                      name="name"
                      placeholder="名前"
                      value={formData.name}
                      onChange={handleChange}
                  />
              </div>
              <div className="input_menu">
                  <label className={styles.label}>メニュー</label> 
                  <select
                      name='menu'
                      className={styles.selectField}
                      //onChange={handleChange}
                      onChange={(e) => setFormData({...formData, menu: e.target.value})}
                  >
                      <option defaultValue="">選択してください</option>
                      <option value="0">ボディトーク</option>
                      <option value="1">ホリスティックコンディション</option>
                      <option value="2">パーソナルフィッティング</option>
                      {/* {options.map((option) => (
                          <option value={option.value} key={option.value}>{option.label}</option>
                      ))} */}
                  </select>
              </div>      
              <div className="input_scheduledate">
                  <label className={styles.label}>予約日</label>    
                  <DateTimePicker
                      name='scheduledate'
                      selected={formData.scheduledate}
                      onChange={(date: Date) => handleDateChange(date, 'scheduledate')}
                      dateFormat="yyyy-MM-dd"
                      placeholderText="予約日"
                      className={styles.datePicker}
                  />
              </div>
              <div className="input_starttime">
                  <label className={styles.label}>予約開始時間</label>  
                  <DateTimePicker
                      name='starttime'
                      selected={formData.starttime}
                      onChange={(date: Date) => handleDateChange(date, 'starttime')}
                      showTimeSelect
                      timeFormat="HH:mm"
                      timeIntervals={60}
                      timeCaption="Time"
                      dateFormat="yyyy-MM-dd HH:mm"
                      placeholderText="開始時間"
                      className={styles.datePicker}
                  />
              </div>
              <div className="input_endtime">
                  <label className={styles.label}>予約終了時間</label>  
                  <DateTimePicker
                      name='endtime'
                      selected={formData.endtime}
                      onChange={(date: Date) => handleDateChange(date, 'endtime')}
                      showTimeSelect
                      timeFormat="HH:mm"
                      timeIntervals={60}
                      timeCaption="Time"
                      dateFormat="yyyy-MM-dd HH:mm"
                      placeholderText="終了時間"
                      className={styles.datePicker}
                  />
              </div>              

              <button type="submit" className={styles.submitButton}>予約を追加</button>
            </form>
     </main>
    </>
  );
};

export default CreateReservation;