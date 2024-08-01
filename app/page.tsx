"use client"

import React, { useState, DragEvent, useEffect } from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { 
  FaCarrot, FaAppleAlt, FaFish, FaEgg, FaCheese, FaBreadSlice, 
  FaPepperHot, FaLemon, FaCoffee, FaIceCream
} from 'react-icons/fa';
import { 
  GiMeat, GiMushroomGills, GiTomato, GiPotato, GiCorn, 
  GiAvocado, GiChocolateBar, GiHoneycomb, GiStrawberry, GiGrapes 
} from 'react-icons/gi';

interface FoodItem {
  id: string;
  name: string;
  icon: React.ReactNode;
}

interface Column {
  id: string;
  title: string;
  items: FoodItem[];
}

type ColumnsState = {
  [key: string]: Column;
};

interface DraggingState {
  itemId: string;
  columnId: string;
}

const foodItems: FoodItem[] = [
  { id: 'carrot', name: 'にんじん', icon: <FaCarrot size={24} /> },
  { id: 'apple', name: 'りんご', icon: <FaAppleAlt size={24} /> },
  { id: 'fish', name: '魚', icon: <FaFish size={24} /> },
  { id: 'egg', name: '卵', icon: <FaEgg size={24} /> },
  { id: 'cheese', name: 'チーズ', icon: <FaCheese size={24} /> },
  { id: 'bread', name: 'パン', icon: <FaBreadSlice size={24} /> },
  { id: 'pepper', name: '唐辛子', icon: <FaPepperHot size={24} /> },
  { id: 'lemon', name: 'レモン', icon: <FaLemon size={24} /> },
  { id: 'coffee', name: 'コーヒー', icon: <FaCoffee size={24} /> },
  { id: 'icecream', name: 'アイスクリーム', icon: <FaIceCream size={24} /> },
  { id: 'meat', name: '肉', icon: <GiMeat size={24} /> },
  { id: 'mushroom', name: 'きのこ', icon: <GiMushroomGills size={24} /> },
  { id: 'tomato', name: 'トマト', icon: <GiTomato size={24} /> },
  { id: 'potato', name: 'じゃがいも', icon: <GiPotato size={24} /> },
  { id: 'corn', name: 'とうもろこし', icon: <GiCorn size={24} /> },
  { id: 'avocado', name: 'アボカド', icon: <GiAvocado size={24} /> },
  { id: 'chocolate', name: 'チョコレート', icon: <GiChocolateBar size={24} /> },
  { id: 'honey', name: 'はちみつ', icon: <GiHoneycomb size={24} /> },
  { id: 'strawberry', name: 'いちご', icon: <GiStrawberry size={24} /> },
  { id: 'grapes', name: 'ぶどう', icon: <GiGrapes size={24} /> },
];

const initialColumns: ColumnsState = {
  ingredients: {
    id: 'ingredients',
    title: '食材リスト',
    items: foodItems,
  },
  recipe: {
    id: 'recipe',
    title: 'レシピの材料',
    items: [],
  }
};

const FoodKanbanBoard: React.FC = () => {
  const [columns, setColumns] = useState<ColumnsState>(initialColumns);
  const [dragging, setDragging] = useState<DraggingState | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const onDragStart = (e: DragEvent<HTMLDivElement>, itemId: string, columnId: string) => {
    setDragging({ itemId, columnId });
    e.dataTransfer.setData('text/plain', itemId);
  };

  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const onDrop = (e: DragEvent<HTMLDivElement>, targetColumnId: string) => {
    e.preventDefault();
    const itemId = e.dataTransfer.getData('text');
    if (!dragging) return;
    const sourceColumnId = dragging.columnId;
    if (sourceColumnId === targetColumnId) return;

    setColumns(prevColumns => {
      const sourceColumn = {...prevColumns[sourceColumnId]};
      const targetColumn = {...prevColumns[targetColumnId]};
      const itemIndex = sourceColumn.items.findIndex(item => item.id === itemId);
      
      if (itemIndex !== -1) {
        const [movedItem] = sourceColumn.items.splice(itemIndex, 1);
        targetColumn.items.push(movedItem);
      }

      return {
        ...prevColumns,
        [sourceColumnId]: sourceColumn,
        [targetColumnId]: targetColumn
      };
    });

    setDragging(null);
  };

  if (!isClient) {
    return null; // または、ローディング表示
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>食材カンバンボード</title>
        <meta name="description" content="食材をドラッグ＆ドロップで選択するカンバンボード" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className={styles.header}>
        <h1 className={styles.headerTitle}>食材カンバンボード</h1>
      </header>

      <main className={styles.main}>
        <div className={styles.board}>
          {Object.values(columns).map((column) => (
            <div 
              key={column.id} 
              className={styles.column}
              onDragOver={onDragOver}
              onDrop={(e) => onDrop(e, column.id)}
            >
              <h2 className={styles.columnTitle}>{column.title}</h2>
              <div className={styles.itemGrid}>
                {column.items.map((item) => (
                  <div
                    key={item.id}
                    draggable
                    onDragStart={(e) => onDragStart(e, item.id, column.id)}
                    className={styles.item}
                    title={item.name}
                  >
                    {item.icon}
                  </div>
                ))}
              </div>
              {column.id === 'recipe' && (
                <div className={styles.selectedIngredients}>
                  選択された材料: {column.items.map(item => item.name).join(', ')}
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default FoodKanbanBoard;