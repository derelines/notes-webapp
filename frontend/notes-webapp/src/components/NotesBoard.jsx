import React, { useState, useCallback } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  ConnectionMode,
  Handle,
  Position,
} from 'reactflow';
import 'reactflow/dist/style.css';

// Кастомный компонент для текстурированных ниток
const RedThreadEdge = (props) => {
  const { sourceX, sourceY, targetX, targetY } = props;
  
  const path = `M ${sourceX},${sourceY} C ${sourceX + 100},${sourceY} ${targetX - 100},${targetY} ${targetX},${targetY}`;

  return (
    <>
      <path
        d={path}
        stroke="rgba(139, 0, 0, 0.3)"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d={path}
        stroke="url(#threadPattern)"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
        strokeDasharray="1, 3"
        style={{
          filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.3))',
          animation: 'threadFlow 3s linear infinite'
        }}
      />
    </>
  );
};

// Компонент стикера с кнопками НА углах
const StickerNode = ({ data }) => {
  return (
    <div style={stickerNodeStyle}>
      {/* Кнопки НА углах стикера */}
      <div style={cornerPinsStyle}>
        {/* Левая верхняя кнопка */}
        <div style={{...cornerPinStyle, top: -6, left: -6}}>
          <Handle
            type="source"
            position={Position.Top}
            id="top-left"
            style={invisibleHandleStyle}
          />
          <div style={cornerPinHeadStyle} />
        </div>
        
        {/* Правая верхняя кнопка */}
        <div style={{...cornerPinStyle, top: -6, right: -6}}>
          <Handle
            type="source"
            position={Position.Top}
            id="top-right"
            style={invisibleHandleStyle}
          />
          <div style={cornerPinHeadStyle} />
        </div>
        
        {/* Правая нижняя кнопка */}
        <div style={{...cornerPinStyle, bottom: -6, right: -6}}>
          <Handle
            type="source"
            position={Position.Bottom}
            id="bottom-right"
            style={invisibleHandleStyle}
          />
          <div style={cornerPinHeadStyle} />
        </div>
        
        {/* Левая нижняя кнопка */}
        <div style={{...cornerPinStyle, bottom: -6, left: -6}}>
          <Handle
            type="source"
            position={Position.Bottom}
            id="bottom-left"
            style={invisibleHandleStyle}
          />
          <div style={cornerPinHeadStyle} />
        </div>
      </div>

      {/* Target handles - отдельно для приема соединений */}
      <Handle
        type="target"
        position={Position.Top}
        style={invisibleHandleStyle}
      />
      <Handle
        type="target"
        position={Position.Right}
        style={invisibleHandleStyle}
      />
      <Handle
        type="target"
        position={Position.Bottom}
        style={invisibleHandleStyle}
      />
      <Handle
        type="target"
        position={Position.Left}
        style={invisibleHandleStyle}
      />

      {/* Содержимое стикера */}
      <div style={stickerContentStyle}>
        <div style={stickerHeaderStyle}>
          <h3 style={titleStyle}>{data.title}</h3>
          <div style={actionsStyle}>
            <button style={actionButtonStyle}>✏️</button>
            <button style={actionButtonStyle}>❌</button>
          </div>
        </div>
        <div style={contentStyle}>
          {data.content}
        </div>
        <div style={footerStyle}>
          <span style={dateStyle}>{data.date}</span>
          <span style={tagStyle}>{data.tag}</span>
        </div>
      </div>
    </div>
  );
};

// Основной стиль стикера с кнопками на углах
const stickerNodeStyle = {
  background: `
    linear-gradient(135deg, #fef3c7 0%, #fde68a 100%),
    repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(254, 202, 202, 0.1) 10px, rgba(254, 202, 202, 0.1) 20px)
  `,
  border: '3px solid #f59e0b',
  borderRadius: '12px',
  boxShadow: `
    0 6px 12px -1px rgba(0, 0, 0, 0.15),
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    inset 0 2px 4px rgba(255, 255, 255, 0.8),
    0 0 0 1px rgba(0,0,0,0.1)
  `,
  minWidth: 220,
  minHeight: 160,
  padding: '0',
  fontFamily: '"Comic Sans MS", cursive, sans-serif',
  cursor: 'grab',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.3s ease',
  position: 'relative',
  overflow: 'visible',
  zIndex: 10,
};

// Контейнер для кнопок на углах
const cornerPinsStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  pointerEvents: 'none',
  zIndex: 20,
};

// Стиль отдельной кнопки на углу
const cornerPinStyle = {
  position: 'absolute',
  width: 24,
  height: 24,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 30,
  pointerEvents: 'visible',
  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
};

// Головка кнопки
const cornerPinHeadStyle = {
  width: 20,
  height: 20,
  background: `
    radial-gradient(circle at 30% 30%, 
      #ff6b6b 0%, 
      #dc2626 30%, 
      #b91c1c 70%,
      #7f1d1d 100%
    )
  `,
  borderRadius: '50% 50% 50% 10%',
  boxShadow: `
    0 3px 6px rgba(0,0,0,0.4),
    inset 3px 3px 6px rgba(255,255,255,0.4),
    inset -3px -3px 6px rgba(0,0,0,0.3),
    0 0 0 2px rgba(255,255,255,0.8),
    0 0 0 3px rgba(220, 38, 38, 0.3)
  `,
  border: '2px solid #991b1b',
  transform: 'rotate(45deg)',
  transition: 'all 0.2s ease',
  cursor: 'crosshair',
  position: 'relative',
};

// Невидимые Handle'ы для соединений
const invisibleHandleStyle = {
  width: 30,
  height: 30,
  background: 'transparent',
  border: 'none',
  borderRadius: '50%',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  cursor: 'crosshair',
  zIndex: 40,
};

// Контент стикера (отдельно от кнопок)
const stickerContentStyle = {
  padding: '20px',
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  zIndex: 5,
  position: 'relative',
};

const stickerHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  marginBottom: '12px',
  borderBottom: '2px dotted #f59e0b',
  paddingBottom: '10px',
};

const titleStyle = {
  margin: 0,
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#92400e',
  flex: 1,
  marginRight: '10px',
  textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
};

const actionsStyle = {
  display: 'flex',
  gap: '6px',
};

const actionButtonStyle = {
  background: 'rgba(245, 158, 11, 0.2)',
  border: '1px solid #f59e0b',
  cursor: 'pointer',
  fontSize: '12px',
  padding: '5px 8px',
  borderRadius: '5px',
  transition: 'all 0.2s',
};

const contentStyle = {
  flex: 1,
  fontSize: '13px',
  color: '#78350f',
  lineHeight: '1.5',
  overflow: 'hidden',
  display: '-webkit-box',
  WebkitLineClamp: 3,
  WebkitBoxOrient: 'vertical',
  fontStyle: 'italic',
};

const footerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: '12px',
  fontSize: '11px',
  borderTop: '1px dashed #f59e0b',
  paddingTop: '10px',
};

const dateStyle = {
  color: '#d97706',
  fontWeight: 'bold',
};

const tagStyle = {
  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
  color: 'white',
  padding: '4px 10px',
  borderRadius: '15px',
  fontSize: '10px',
  fontWeight: 'bold',
  boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
};

const nodeTypes = {
  sticker: StickerNode,
};

const edgeTypes = {
  redThread: RedThreadEdge,
};

// Начальные данные
const initialNodes = [
  {
    id: '1',
    type: 'sticker',
    position: { x: 100, y: 100 },
    data: {
      title: 'Стикер 1',
      content: 'Между стикерами может быть только одна связь',
      date: 'Сегодня',
      tag: 'Инфо',
    },
  },
  {
    id: '2',
    type: 'sticker',
    position: { x: 400, y: 200 },
    data: {
      title: 'Стикер 2',
      content: 'Попробуйте создать вторую связь - она не добавится',
      date: 'Сейчас',
      tag: 'Тест',
    },
  },
];

const initialEdges = [];

const NotesBoard = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [connectionError, setConnectionError] = useState('');

  // Функция проверки существующей связи между двумя стикерами
  const connectionExists = useCallback((sourceId, targetId) => {
    return edges.some(edge => 
      (edge.source === sourceId && edge.target === targetId) ||
      (edge.source === targetId && edge.target === sourceId) // Проверяем в обе стороны
    );
  }, [edges]);

  const onConnect = useCallback(
    (params) => {
      console.log('Параметры соединения:', params);
      
      // Проверяем, существует ли уже связь между этими стикерами
      if (connectionExists(params.source, params.target)) {
        setConnectionError(`⚠️ Связь между стикерами ${params.source} и ${params.target} уже существует!`);
        setTimeout(() => setConnectionError(''), 3000); // Автоочистка через 3 секунды
        console.log('Связь уже существует, отменяем создание');
        return; // Не создаем новую связь
      }
      
      // Если связи нет - создаем
      const newEdge = {
        ...params,
        type: 'redThread',
        id: `e${params.source}-${params.sourceHandle}-${params.target}-${Date.now()}`,
      };
      setEdges((eds) => addEdge(newEdge, eds));
      setConnectionError(''); // Очищаем ошибку если была
      console.log('Создана новая связь');
    },
    [setEdges, connectionExists]
  );

  const addNewSticker = useCallback(() => {
    const newNode = {
      id: `${Date.now()}`,
      type: 'sticker',
      position: {
        x: Math.random() * 600,
        y: Math.random() * 400,
      },
      data: {
        title: 'Новый стикер',
        content: 'Между стикерами может быть только одна связь',
        date: 'Только что',
        tag: 'Новый',
      },
    };
    setNodes((nds) => [...nds, newNode]);
  }, [setNodes]);

  // Функция удаления связи по двойному клику
  const onEdgeDoubleClick = useCallback((event, edge) => {
    setEdges((eds) => eds.filter((e) => e.id !== edge.id));
    console.log('Удалена связь:', edge.id);
  }, [setEdges]);

  return (
    <div style={{ width: '100%', height: '70vh', position: 'relative' }}>
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          <pattern id="threadPattern" patternUnits="userSpaceOnUse" width="4" height="4">
            <path d="M 0,2 Q 1,1 2,2 T 4,2" stroke="#dc2626" strokeWidth="0.5" fill="none" />
            <path d="M 0,3 Q 1,2 2,3 T 4,3" stroke="#b91c1c" strokeWidth="0.3" fill="none" />
          </pattern>
        </defs>
      </svg>

      {/* Панель управления */}
      <div style={controlPanelStyle}>
        <button onClick={addNewSticker} style={addButtonStyle}>
          📌 Добавить стикер
        </button>
        
        {/* Сообщение об ошибке */}
        {connectionError && (
          <div style={errorMessageStyle}>
            {connectionError}
          </div>
        )}
        
        <div style={modeIndicatorStyle}>
          <span style={{ color: '#dc2626', fontWeight: 'bold' }}>
            🎯 ОДНА СВЯЗЬ МЕЖДУ СТИКЕРАМИ
          </span>
        </div>
        
        <div style={instructionBoxStyle}>
          <strong>Правила связей:</strong>
          <ul style={instructionListStyle}>
            <li>✅ <strong>Одна связь</strong> между двумя стикерами</li>
            <li>🔄 Связь работает в обе стороны</li>
            <li>🧵 <strong>Двойной клик</strong> по нитке для удаления</li>
            <li>🔴 Новые связи не создаются если уже есть</li>
          </ul>
        </div>
      </div>

      {/* Доска со стикерами */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onEdgeDoubleClick={onEdgeDoubleClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        connectionMode={ConnectionMode.Loose}
        fitView
        style={flowStyle}
        defaultEdgeOptions={{ type: 'redThread' }}
        nodesConnectable={true}
        elementsSelectable={true}
        panOnScroll={true}
        zoomOnScroll={true}
        connectionLineStyle={{
          stroke: '#dc2626',
          strokeWidth: 2.5,
          strokeDasharray: '1, 3',
        }}
        connectionLineType="smoothstep"
      >
        <Background 
          variant="dots"
          gap={40}
          size={1}
          color="#e2e8f0"
          style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)' }}
        />
        <MiniMap nodeColor="#f59e0b" style={miniMapStyle} />
        <Controls style={controlsStyle} />
      </ReactFlow>

      <style>
        {`
          @keyframes threadFlow {
            0% { stroke-dashoffset: 0; }
            100% { stroke-dashoffset: -8; }
          }
        `}
      </style>
    </div>
  );
};

// Стиль для сообщения об ошибке
const errorMessageStyle = {
  background: 'linear-gradient(135deg, #fef2f2, #fee2e2)',
  border: '2px solid #fecaca',
  color: '#dc2626',
  padding: '12px',
  borderRadius: '8px',
  fontSize: '13px',
  fontWeight: 'bold',
  textAlign: 'center',
  animation: 'shake 0.5s ease-in-out',
};

// Стили панели управления
const controlPanelStyle = {
  position: 'absolute',
  top: '10px',
  left: '10px',
  zIndex: 1000,
  background: 'rgba(255, 255, 255, 0.95)',
  padding: '20px',
  borderRadius: '15px',
  boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.1)',
  display: 'flex',
  flexDirection: 'column',
  gap: '15px',
  border: '2px solid #e2e8f0',
  minWidth: '320px',
  backdropFilter: 'blur(10px)',
};

const addButtonStyle = {
  background: 'linear-gradient(135deg, #10b981, #059669)',
  color: 'white',
  border: 'none',
  padding: '14px 24px',
  borderRadius: '10px',
  cursor: 'pointer',
  fontWeight: 'bold',
  fontSize: '14px',
  transition: 'all 0.3s ease',
  boxShadow: '0 4px 6px rgba(16, 185, 129, 0.3)',
};

const modeIndicatorStyle = {
  fontSize: '14px',
  color: '#6b7280',
  fontWeight: '500',
  background: 'linear-gradient(135deg, #fef2f2, #fee2e2)',
  padding: '12px',
  borderRadius: '8px',
  lineHeight: '1.4',
  border: '2px solid #fecaca',
  textAlign: 'center',
};

const instructionBoxStyle = {
  background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)',
  padding: '15px',
  borderRadius: '8px',
  border: '2px solid #bae6fd',
  fontSize: '13px',
  lineHeight: '1.5',
};

const instructionListStyle = {
  margin: '10px 0 0 0',
  paddingLeft: '0',
  fontSize: '12px',
  color: '#0369a1',
  lineHeight: '1.6',
  listStyle: 'none',
};

const flowStyle = {
  background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
  borderRadius: '15px',
  border: '3px solid #e2e8f0',
};

const miniMapStyle = {
  background: 'rgba(255, 255, 255, 0.9)',
  borderRadius: '10px',
  border: '2px solid #e2e8f0',
};

const controlsStyle = {
  background: 'rgba(255, 255, 255, 0.95)',
  borderRadius: '10px',
  border: '2px solid #e2e8f0',
};

// CSS анимация для сообщения об ошибке
const style = document.createElement('style');
style.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
  }
`;
document.head.appendChild(style);

export default NotesBoard;