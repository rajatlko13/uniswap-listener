import React from 'react';
import Card from './Card';
import http from '../utilities/http';
import { useState } from 'react';
import { useEffect } from 'react';

const Records = () => {

    const [records, setRecords] = useState([]);

    useEffect(() => {
        async function fetchRecords() {
            try {
                const res = await http.get('/records');
                setRecords(res.data.data);
            } catch (error) {
                console.log("Error in fetching records: ", error);
            }
        }

        fetchRecords();
    }, []);

    const renderRecords = () => {
        return records.map((record, key) => {
            return <Card index={key} record={record} />
        })
    }

    return ( 
        <div style={{ marginTop: '50px'}}>
            {renderRecords()}
        </div>
    );
}
 
export default Records;