import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Profile.module.css';

interface Genre {
  id: number;
  name: string;
}

const GENRES: Genre[] = [
  { id: 1, name: 'Драма' },
  { id: 2, name: 'Комедия' },
  { id: 3, name: 'Боевик' },
  { id: 4, name: 'Триллер' },
  { id: 5, name: 'Ужасы' },
  { id: 6, name: 'Фантастика' },
  { id: 7, name: 'Романтика' },
  { id: 8, name: 'Детектив' },
  { id: 9, name: 'Приключения' },
  { id: 10, name: 'Анимация' },
  { id: 11, name: 'Документальный' },
  { id: 12, name: 'Вестерн' },
];

interface UserData {
  name?: string;
  genres?: number[];
}

export function Profile() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://localhost:3030/profile');
        if (response.ok) {
          const userData: UserData = await response.json();
          if (userData.name) {
            setName(userData.name);
          }
          if (userData.genres && Array.isArray(userData.genres)) {
            setSelectedGenres(userData.genres);
          }
        }
      } catch (error) {
        console.error('Ошибка загрузки данных пользователя:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleGenreToggle = async (genreId: number) => {
    const isSelected = selectedGenres.includes(genreId);
    
    if (isSelected) {
      // Удаление обрабатывается через handleGenreRemove
      return;
    }
    
    if (selectedGenres.length >= 3) {
      return;
    }

    try {
      const response = await fetch('http://localhost:3030/favorite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ genre: genreId }),
      });

      if (response.ok) {
        setSelectedGenres((prev) => [...prev, genreId]);
      } else {
        console.error('Ошибка добавления жанра');
      }
    } catch (error) {
      console.error('Ошибка добавления жанра:', error);
    }
  };

  const handleGenreRemove = async (e: React.MouseEvent, genreId: number) => {
    e.stopPropagation();
    
    try {
      const response = await fetch('http://localhost:3030/favorite', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ genre: genreId }),
      });

      if (response.ok) {
        setSelectedGenres((prev) => prev.filter((id) => id !== genreId));
      } else {
        console.error('Ошибка удаления жанра');
      }
    } catch (error) {
      console.error('Ошибка удаления жанра:', error);
    }
  };

  const handleSaveName = async () => {
    try {
      const response = await fetch('http://localhost:3030/name', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      });

      if (response.ok) {
        console.log('Имя успешно сохранено');
      } else {
        console.error('Ошибка сохранения имени');
      }
    } catch (error) {
      console.error('Ошибка сохранения имени:', error);
    }
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <button onClick={() => navigate(-1)} className={styles.backButton}>
          Назад
        </button>
        <h1 className={styles.title}>Профиль</h1>
        <p>Загрузка...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <button onClick={() => navigate(-1)} className={styles.backButton}>
        Назад
      </button>
      <h1 className={styles.title}>Профиль</h1>
      
      <div className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="name" className={styles.label}>
            Имя
          </label>
          <div className={styles.nameInputContainer}>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Введите ваше имя"
              className={styles.input}
            />
            <button
              onClick={handleSaveName}
              className={styles.saveButton}
            >
              Сохранить
            </button>
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>
            Любимые жанры (максимум 3)
          </label>
          <div className={styles.genresContainer}>
            {GENRES.map((genre) => {
              const isSelected = selectedGenres.includes(genre.id);
              const isDisabled = !isSelected && selectedGenres.length >= 3;
              
              return (
                <button
                  key={genre.id}
                  onClick={() => handleGenreToggle(genre.id)}
                  disabled={isDisabled}
                  className={`${styles.chip} ${isSelected ? styles.chipSelected : ''} ${isDisabled ? styles.chipDisabled : ''}`}
                >
                  <span>{genre.name}</span>
                  {isSelected && (
                    <button
                      className={styles.chipClose}
                      onClick={(e) => handleGenreRemove(e, genre.id)}
                      aria-label="Удалить жанр"
                    >
                      ×
                    </button>
                  )}
                </button>
              );
            })}
          </div>
          {selectedGenres.length > 0 && (
            <p className={styles.selectedCount}>
              Выбрано: {selectedGenres.length} / 3
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

