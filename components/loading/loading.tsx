import { LoadingOutlined } from '@ant-design/icons';
import React from 'react';

export default function Loading() {
    return (
        <div className="loading-overlay">
            <div className="loading-indicator"><LoadingOutlined /> <span className='ml-6'>Đang xử lý...</span></div>
        </div>
    );
}