import {
	useMutation,
	useQuery,
	useQueryClient,
} from '@tanstack/react-query'
import axios from 'axios'

export type TodoReq = {
    id: string
    title: string
    completed: boolean
    createdAt: string
}

export const useListTodos = () => {
    return useQuery({
        queryKey: ['todos'],
        queryFn: async () => {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/todos`)
            return res.data as TodoReq[]
        }
    })
}

export const useAddTodo = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (title: string) => {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/todos`, { title })
            return res.data as TodoReq
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['todos'] })
        }
    })
}

export const useUpdateTodo = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (todo: TodoReq) => {
            const res = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/todos/${todo.id}`, todo)
            return res.data as TodoReq
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['todos'] })
        }
    })
}

export const useDeleteTodo = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (id: string) => {
            const res = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/todos/${id}`)
            return res.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['todos'] })
        }
    })
}

export const useGetTodo = (id: string) => {
    return useQuery({
        queryKey: ['todos', id],
        queryFn: async () => {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/todos/${id}`)
            return res.data as TodoReq
        },
    })
}