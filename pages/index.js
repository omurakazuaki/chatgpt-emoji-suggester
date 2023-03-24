import styles from '../styles/SearchEmoji.module.css'

import { useState } from 'react';

const SearchEmoji = () => {
  const [input, setInput] = useState('');
  const [emojis, setEmojis] = useState([]);
  const [isLoading, setLoading] = useState(false);

  const handleSearch = async (event) => {
    event.preventDefault();
    setEmojis([]);
    setLoading(true);
    const response = await fetch(`/api/emoji?prompt=${input}`);
    const data = await response.json();
    setLoading(false);
    setEmojis(data.emojis);
  };

  const handleEmojiClick = (emoji) => {
    navigator.clipboard.writeText(emoji);
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search for emojis..."
          value={input}
          disabled={isLoading}
          onChange={(e) => setInput(e.target.value)}
        />
      </form>
      <div className={styles.results}>
        {isLoading && <div className={styles.loading}>Loading...</div>}
        {emojis.map((emoji, index) => (
          <div className={styles.result} key={index} onClick={() => handleEmojiClick(emoji.emoji)}>
            <div className={styles.emoji}>{emoji.emoji}</div>
            <div className={styles.name}>{emoji.name}</div>
            <div className={styles.reason}>{emoji.reason}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchEmoji;
