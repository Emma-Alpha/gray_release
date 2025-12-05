import UnFindPng from '@config/public/404.png';
import { Button, Empty } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router';

export const UnPageFind = () => {
  const navigate = useNavigate();

  return (
    <div className='p-4 w-full h-full relative flex justify-center items-center'>
      <Empty
        image={UnFindPng}
        description={
          <div className='flex flex-col gap-2 justify-center items-center'>
            <h2>抱歉，页面无法访问…</h2>
            <span>404，网址错误或已失效。请检查网址。</span>
            <Button size={'large'} type={'primary'} className='w-24' onClick={() => navigate('/')}>
              返回首页
            </Button>
          </div>
        }
      ></Empty>
    </div>
  );
};

export default UnPageFind;
