import { NextApiRequest, NextApiResponse } from "next";
import { Client } from 'pg';

// interface Reservations {
//     id: number;
//     line_uid: string;
//     name: string;
//     scheduledate: string;
//     starttime: number;
//     endtime: number;
//     menu: string;
// }

export default async function handler(req:NextApiRequest, res:NextApiResponse) {

    const connection = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: {
          rejectUnauthorized: false
        }
      });
      
    try {
        console.log('req.bodyは（reservation_createの中:', req.body)

      await connection.connect();
 
    //   PostgreSQL の timestamp型はDateオブジェクトを直接受け取れるので
    //  starttimeとendtimeは Dateオブジェクトのまま渡せます。scheduledateは文字列のまま渡します
      const insertQuery = {
        text: 'INSERT INTO reservations (line_uid, name, scheduledate, starttime, endtime, menu) VALUES ($1, $2, $3, $4, $5, $6)',
        values: [
            req.body.line_uid,
            req.body.name,
            req.body.scheduledate, // 文字列
            req.body.starttime, // Date オブジェクト（タイムスタンプ型）
            req.body.endtime, // Date オブジェクト（タイムスタンプ型）
            req.body.menu
        ]
      };

      await connection.query(insertQuery);
      res.status(200).json({ message: "APIにて予約追加成功" });
    } catch(err) {
        console.log('Error executing SELECT query', err);
        res.status(500).json({error: "APIにて予約追加失敗"});
    } finally {
        await connection.end()
    }

}