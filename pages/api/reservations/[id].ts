import { NextApiRequest, NextApiResponse } from 'next';
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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  console.log('△[id].tsのidは：', id);

  const connection = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    if (req.method === 'DELETE') {
        await connection.connect();
      // データベースから予約データを削除する
        const deleteQuery = {
            text: 'DELETE FROM reservations where id = $1',
            values: [id as string]
        };
        await connection.query(deleteQuery);
        res.status(200).json({ message: "APIにて予約削除成功" });
    } else {
      res.setHeader('Allow', ['DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Error deleting reservation:', error);
    res.status(500).json({ message: 'Error deleting reservation' });
  }
}