<template>
  <div id="app">
    <nav>
      <div class="nav-wrapper blue darken-1">
        <a href="#" class="brand-logo center">Contas Bancárias</a>
      </div>
    </nav>

    <div class="container">
      <ul>
        <li v-for="(erro, index) of errors" :key="index">
          campo
          <b>{{ erro.field}}</b>
          - {{ erro.defaultMessage }}
        </li>
      </ul>

      <form @submit.prevent="salvar">
        <label>Responsavel</label>
        <input
          type="text"
          v-bind:disabled="depositoShow || saqueShow ||transferenciaEnviadaShow || transferenciaRecebidaShow"
          placeholder="Responsavel"
          v-model="conta.responsavel"
        />
        <label>Número</label>
        <input
          type="text"
          v-bind:disabled="depositoShow || saqueShow ||transferenciaEnviadaShow || transferenciaRecebidaShow"
          placeholder="Número"
          v-model="conta.numero"
        />
        <label>Saldo</label>
        <input
          type="number"
          v-bind:disabled="depositoShow || saqueShow ||transferenciaEnviadaShow || transferenciaRecebidaShow||!editShow"
          placeholder="Saldo"
          v-model="conta.saldo"
        />
        <template v-if="depositoShow == true">
          <h6 class="brand-logo center">Depósito</h6>
          <input type="text" placeholder="Responsável" v-model="movimentacao.responsavelTransacao" />
          <input type="number" placeholder="Valor" v-model="movimentacao.valor" />
        </template>
        <template v-if="saqueShow == true">
          <h6 class="brand-logo center">Saque</h6>
          <input type="number" placeholder="Saque" v-model="movimentacao.valor" />
        </template>
        <template v-if="transferenciaRecebidaShow == true">
          <h6 class="brand-logo center">Transferência Recebida</h6>
          <h6>Dados do Remetente</h6>
          <input type="text" placeholder="Responsável" v-model="movimentacao.responsavelTransacao" />
          <input
            type="text"
            placeholder="Nº da Conta"
            v-model="movimentacao.numeroContaTransferencia"
          />
          <input type="number" placeholder="Valor" v-model="movimentacao.valor" />
        </template>
        <template v-if="transferenciaEnviadaShow == true">
          <h6 class="brand-logo center">Transferência Enviada</h6>
          <h6>Dados de Destino</h6>
          <input type="text" placeholder="Responsável" v-model="movimentacao.responsavelTransacao" />
          <input
            type="text"
            placeholder="Nº da Conta"
            v-model="movimentacao.numeroContaTransferencia"
          />
          <input type="number" placeholder="Depósito" v-model="movimentacao.valor" />
        </template>
        <button class="waves-effect waves-light btn-small">
          Salvar
          <i class="material-icons left">save</i>
        </button>
       </form>

      <table>
        <thead>
          <tr>
            <th>RESPONSAVEL</th>
            <th>NUMERO</th>
            <th>SALDO</th>
            <th>OPÇÕES</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="conta of contas" :key="conta.id">
            <td>{{ conta.responsavel }}</td>
            <td>{{ conta.numero }}</td>
            <td>{{ conta.saldo }}</td>
            <td>
              <button
                id="alterar"
                @click="alterar(conta);editShow=false;depositoShow=false;saqueShow=false;transferenciaRecebidaShow=false,transferenciaEnviadaShow=false"
                class="waves-effect btn-small blue darken-1"
              >
                <i class="material-icons">create</i>
              </button>
              <button
                id="deletar"
                @click="deletar(conta)"
                class="waves-effect btn-small red darken-1"
              >
                <i class="material-icons">delete_sweep</i>
              </button>
              <button
                id="deposito"
                @click="alterar(conta);depositoShow=true;saqueShow=false;transferenciaRecebidaShow=false,transferenciaEnviadaShow=false"
                class="waves-effect btn-small green darken-1"
              >
                <i class="material-icons">arrow_circle_down</i>
              </button>
              <button
                id="saque"
                @click="alterar(conta);saqueShow=true;depositoShow=false;transferenciaRecebidaShow=false;transferenciaEnviadaShow=false"
                class="waves-effect btn-small purple darken-1"
              >
                <i class="material-icons">arrow_circle_up</i>
              </button>
              <button
                id="enviada"
                @click="alterar(conta);saqueShow=false;depositoShow=false;transferenciaRecebidaShow=false;transferenciaEnviadaShow=true"
                class="waves-effect btn-small pink darken-1"
              >
                <i class="material-icons">autorenew</i>
              </button>
              <button
                id="recebida"
                @click="alterar(conta);saqueShow=false;depositoShow=false;transferenciaEnviadaShow=false;transferenciaRecebidaShow=true"
                class="waves-effect btn-small yelow darken-1"
              >
                <i class="material-icons">autorenew</i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import Conta from "./services/contas";
import Movimentacao from "./services/movimentacao";

export default {
  data() {
    return {
      conta: {
        id: "",
        responsavel: "",
        numero: "",
        saldo: ""
      },
      contas: [],
      errors: [],
      editShow: Boolean,
      depositoShow: Boolean,
      saqueShow: Boolean,
      transferenciaRecebidaShow: Boolean,
      transferenciaEnviadaShow: Boolean,
      movimentacao: {
        id: "",
        conta: "",
        tipo: "",
        responsavelTransacao: "",
        numeroContaTransferencia: "",
        valor: "",
        data: ""
      }
    };
  },

  mounted() {
    this.listar();
  },

  methods: {
    listar() {
      Conta.listar().then(resposta => {
        this.contas = resposta.data;
        (this.depositoShow = false),
          (this.saqueShow = false),
          (this.transferenciaRecebidaShow = false),
          (this.transferenciaEnviadaShow = false);
      });
    },

    salvar() {
      console.log(this.depositoShow);
      if (!this.conta.id) {
        Conta.salvar(this.conta)
          .then(resposta => {
            console.log(resposta);
            this.conta = {};
            alert("Conta salva com sucesso!");
          })
          .catch(e => {
            console.log(e.response.data);
          });
      } else {
        if (
          !this.saqueShow &&
          !this.depositoShow &&
          !this.transferenciaRecebidaShow &&
          !this.transferenciaEnviadaShow
        ) {
          Conta.alterar(this.conta)
            .then(resposta => {
              console.log(resposta);
              this.conta = {};
              this.movimentacao = {};
              alert("Conta atualizada com sucesso!");
            })
            .catch(e => {
              this.errors = e.response.data.errors;
            });
        }
        if (this.saqueShow) {
          if (this.movimentacao.valor <= 0 || this.movimentacao.valor == null) {
            alert("O valor do saque não pode ser menor ou igual a zero");
          } else if (this.movimentacao.valor > this.conta.saldo) {
            alert(
              "O valor do saque não pode ser maior que o saldo da conta corrente"
            );
          } else {
            this.conta.saldo =
              parseFloat(this.conta.saldo) -
              parseFloat(this.movimentacao.valor);
            this.movimentacao.tipo = "S";
            this.movimentacao.conta = this.conta;
            this.movimentacao.data = new Date();
            this.movimentacao.responsavelTransacao = this.conta.responsavel;
            Movimentacao.salvar(this.movimentacao);
            Conta.alterar(this.conta);
            this.conta = {};
            this.movimentacao = {};
            alert("Saque realizado com sucesso!");
          }
        }
        if (this.depositoShow) {
          if (this.movimentacao.valor <= 0 || this.movimentacao.valor == null) {
            alert("O valor do depósito não pode ser menor ou igual a zero");
          } else {
            this.conta.saldo =
              parseFloat(this.conta.saldo) +
              parseFloat(this.movimentacao.valor);
            this.movimentacao.tipo = "D";
            this.movimentacao.conta = this.conta;
            this.movimentacao.data = new Date();
            Movimentacao.salvar(this.movimentacao);
            Conta.alterar(this.conta);
            this.conta = {};
            this.movimentacao = {};
            alert("Depósito realizado com sucesso!");
          }
        }
        if (this.transferenciaRecebidaShow) {
          if (this.movimentacao.valor <= 0 || this.movimentacao.valor == null) {
            alert(
              "O valor da transferência recebida não pode ser menor ou igual a zero"
            );
          } else {
            this.conta.saldo =
              parseFloat(this.conta.saldo) +
              parseFloat(this.movimentacao.valor);
            this.movimentacao.tipo = "TR";
            this.movimentacao.conta = this.conta;
            this.movimentacao.data = new Date();
            Movimentacao.salvar(this.movimentacao);
            Conta.alterar(this.conta);
            this.conta = {};
            this.movimentacao = {};
            alert("Transferência recebida com sucesso!");
          }
        }
        if (this.transferenciaEnviadaShow) {
          if (this.movimentacao.valor <= 0 || this.movimentacao.valor == null) {
            alert(
              "O valor da transferência enviada não pode ser menor ou igual a zero"
            );
          } else {
            this.conta.saldo =
              parseFloat(this.conta.saldo) -
              parseFloat(this.movimentacao.valor);
            this.movimentacao.tipo = "TE";
            this.movimentacao.conta = this.conta;
            this.movimentacao.data = new Date();
            Movimentacao.salvar(this.movimentacao);
            Conta.alterar(this.conta);
            this.conta = {};
            this.movimentacao = {};
            alert("Transferência Enviada com sucesso!");
          }
        }
      }
      this.listar();
      window.location.reload();
    },
    alterar(conta) {
      this.conta = conta;
    },
    deletar(conta) {
      if (confirm("Deseja realmente excluir essa conta?")) {
        Conta.deletar(conta)
          .then(resposta => {
            console.log(resposta.data);
            this.listar();
            this.errors = [];
          })
          .catch(e => {
            this.errors = e.response.data.errors;
          });
      }
    }
  }
};
</script>

