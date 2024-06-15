import { useEffect } from 'react';
import Pusher from 'pusher-js';
import Constants from '@/commons/environment';

const usePusher = (channelName: string, eventName: string, callback: (data: any) => void) => {
    useEffect(() => {
        const pusher = new Pusher(Constants.PUSHER_KEY, {
            cluster: Constants.PUSHER_CLUSTER,
        });

        const channel = pusher.subscribe(channelName);
        channel.bind(eventName, callback);

        return () => {
            channel.unbind(eventName, callback);
            pusher.unsubscribe(channelName);
        };
    }, [channelName, eventName, callback]);
};

export default usePusher;