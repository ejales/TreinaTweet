import { useState, useMemo } from 'react';
import { useApi } from '../useApi';
import { ApiService } from '../../services/ApiService';
import { mutate } from 'swr';

export function useIndex() {
  const maxTextLength = 125,
  user = {
    name: 'Eric Jales',
    username: 'ejales',
    picture: 'https://github.com/ejales.png',
  },
  [text, setText] = useState(''),
  tweetsList = useApi('tweets').data,
  sortedTweetList = useMemo(() => {
    return (tweetsList || []).sort((a,b) => a.data.date < b.data.date ? 1 : -1);
  }, [tweetsList]);

  function onTextChange(event){
    const text = event.target.value;
    if(text.length <= maxTextLength){
      setText(text);
    }
  }

  async function sendTweet() {
    await ApiService.post('tweets', {
      data: {
        user,
        text,
        date: new Date().toISOString()
      }
    })
    setText('');
    mutate('tweets');
  }

  return {
    user,
    text,
    onTextChange,
    maxTextLength,
    sendTweet,
    sortedTweetList,
  };
}