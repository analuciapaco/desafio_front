import { http } from './config'
export default {
    listar: () => {
        return http.get('movimentacao')
    },
    salvar: (movimentacao) => {
        return http.post('movimentacao', movimentacao)
    },
    alterar: (movimentacao) => {
        return http.put('movimentacao', movimentacao)
    },
    deletar: (movimentacao) => {
        return http.delete('movimentacao', { data: movimentacao })
    }
}