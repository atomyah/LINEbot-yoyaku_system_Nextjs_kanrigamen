import { NextApiRequest, NextApiResponse } from "next";
import { Client } from 'pg';

interface Reservations {
    id: number;
    line_uid: string;
    name: string;
    scheduledate: Date;
    starttime: number;
    endtime: number;
    menu: string;
  }

  export default async function handler(req:NextApiRequest, res:NextApiResponse) {

    const connection = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: {
          rejectUnauthorized: false
        }
      });
      
    try {
      connection.connect();  
      const selectQuery = {
        text: 'SELECT * FROM reservations;'
      }; 
      const result = await connection.query<Reservations>(selectQuery);
      const reservedData = result.rows;
      res.status(200).json(reservedData);
      console.log('reservedDateは(APIの中)：', reservedData);
    } catch(err) {
        console.log('Error executing SELECT query', err);
        res.status(500).json({error: "Failed to fetch reservations table"});
    } finally {
        await connection.end()
    }

}