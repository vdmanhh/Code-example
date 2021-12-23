import { isArray } from 'lodash';
import { useEffect, useState } from 'react';
import { Router, useHistory } from 'react-router-dom';

import { handleGetClans, handleGetCurrencies, handleGetRarities } from 'redux/init/slice';
import Socket from 'services/accounts/SocketService';
import { useAppDispatch, useAppSelector } from './store';

export const useInit = (isAdmin: boolean) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isAdmin) {
      dispatch(handleGetClans());
      dispatch(handleGetCurrencies());
      dispatch(handleGetRarities());
    }
  }, [isAdmin]);
};

export const useSocket = ({
  event,
  handleEvent,
  dependences,
  nonAuthen,
}: {
  event: string | string[];
  handleEvent: any;
  dependences?: any;
  nonAuthen?: boolean;
}) => {
  const { address, listAddress } = useAppSelector((state) => state.address) as any;
  const data = {
    data: {
      address: address,
      startTime: listAddress?.[address]?.startTime,
      expiredTime: listAddress?.[address]?.expiredTime,
    },
    signature: listAddress?.[address]?.signature,
  };
  const token = JSON.stringify(data);

  useEffect(() => {
    const socketIo = new Socket();
    const socketInstance = socketIo.getInstance(address);
    if (address || nonAuthen) {
      if (typeof event === 'string') {
        socketInstance.on(event, handleEvent);
      } else if (isArray(event)) {
        event.forEach((e: string) => {
          socketInstance.on(e, handleEvent);
        });
      }
    }
    return () => {
      if (address || nonAuthen) {
        if (typeof event === 'string') {
          socketInstance.off(event, handleEvent);
        } else if (isArray(event)) {
          event.forEach((e: string) => {
            socketInstance.off(e, handleEvent);
          });
        }
      }
    };
  }, [address, ...(dependences || [])]);
};

// export const useWarningBackPage = (allowLoad: any, setVisibleModalUnsaveChange: any, history: any) => {
//   // const [load, setLoad] = useState(false);
//   // useEffect(() => {
//   //   window.history.pushState(null, window.location.pathname);
//   //   window.onbeforeunload = function () {
//   //     return true
//   //   };
//   //   return () => {
//   //     window.removeEventListener('popstate', onBackButtonEvent);
//   //   }
//   // }, []);
//   useEffect(()=> {
//     if(!allowLoad) {
//       window.history.pushState(null, window.location.pathname);
//       window.addEventListener('popstate', onBackButtonEvent);
//     //   window.onbeforeunload = function () {
//     //   return true
//     // };
//     }
//     return () => {
//       window.removeEventListener('popstate', onBackButtonEvent);
//     }
//   },[allowLoad])
//   const onBackButtonEvent = (e: any) => {
//     e.preventDefault();
//     setVisibleModalUnsaveChange(true);
//   }
// };
