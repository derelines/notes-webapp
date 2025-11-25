import { useGetNotesQuery, useDeleteNoteMutation } from '../api/apiSlice'

function NotesList() {
  // Используем хук для получения заметок
  const { 
    data: notes, 
    isLoading, 
    isError, 
    error 
  } = useGetNotesQuery()
  
  // Хук для удаления заметки
  const [deleteNote] = useDeleteNoteMutation()

  if (isLoading) return <div>Загрузка заметок...</div>
  if (isError) return <div>Ошибка: {error.data?.message}</div>

  return (
    <div>
      <h2>Мои заметки</h2>
      {notes?.map(note => (
        <div key={note.id} className="note-card">
          <h3>{note.title}</h3>
          <p>{note.content}</p>
          <button onClick={() => deleteNote(note.id)}>
            Удалить
          </button>
        </div>
      ))}
    </div>
  )
}

export default NotesList