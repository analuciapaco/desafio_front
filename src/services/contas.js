import { http } from './config'
export default {
    listar: () => {
        return http.get('contas')
    },
    salvar: (conta) => {
        return http.post('conta', conta)
    },
    alterar: (conta) => {
        return http.put('conta', conta)
    },
    deletar: (conta) => {
        return http.delete('conta', { data: conta })
    }
}