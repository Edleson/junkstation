module.exports = function(app) {
    var pagseguro = {};
    /*********************************************************
    * Tipo de transação utilizada pelo comprador             *
    **********************************************************/
    var tipoTransacao = [
        {codigo : 1  , nome : "Pagamento" },
        {codigo : 11 , nome : "Assinatura"}
    ];
 
    /*********************************************************
    * Status do pagamento retornado pelo pagseguro           *
    **********************************************************/
    var status = [
        /*********************************************************
        * Status do Pagseguro                                    *
        **********************************************************/
        {codigo : 1  , nome : "Aguardando pagamento"    },
        {codigo : 2  , nome : "Em análise"              },
        {codigo : 3  , nome : "Paga"                    },
        {codigo : 4  , nome : "Disponível"              },
        {codigo : 5  , nome : "Em disputa"              },
        {codigo : 6  , nome : "Devolvida"               },
        {codigo : 7  , nome : "Cancelada"               },
        {codigo : 8  , nome : "Devolvido ao comprador"  },
        {codigo : 9  , nome : "Em contestação"          },
        /*********************************************************
        * Status da Aplicação                                    *
        **********************************************************/
        {codigo : 20 , nome : "Vencido"                 },
        {codigo : 21 , nome : "Cancelado pelo Cliente"  }

    ];

    /*********************************************************
    * Tipo de pagamento utilizado na compra                  *
    **********************************************************/
    var tipoPagamento = [
        {codigo : 1  , nome : "Cartão de crédito"       },
        {codigo : 2  , nome : "Boleto"                  },
        {codigo : 3  , nome : "Débito online (TEF)"     },
        {codigo : 4  , nome : "Saldo PagSeguro"         },
        {codigo : 5  , nome : "Oi Paggo"                },
        {codigo : 7  , nome : "Depósito em conta"       } 
    ];

    /*********************************************************
    * Tipo de identificador do pagamento                  *
    **********************************************************/
    var identificadorPagamento = [
        {codigo : 101  , nome : "Cartão de crédito Visa"                },
        {codigo : 102  , nome : "Cartão de crédito MasterCard"          },
        {codigo : 103  , nome : "Cartão de crédito American Express"    },
        {codigo : 104  , nome : "Cartão de crédito Diners"              },
        {codigo : 105  , nome : "Cartão de crédito Hipercard"           },
        {codigo : 106  , nome : "Cartão de crédito Aura"                },
        {codigo : 107  , nome : "Cartão de crédito Elo"                 },
        {codigo : 108  , nome : "Cartão de crédito PLENOCard"           },
        {codigo : 109  , nome : "Cartão de crédito PersonalCard"        },
        {codigo : 110  , nome : "Cartão de crédito JCB"                 },
        {codigo : 111  , nome : "Cartão de crédito Discover"            },
        {codigo : 112  , nome : "Cartão de crédito BrasilCard"          },
        {codigo : 113  , nome : "Cartão de crédito FORTBRASIL"          },
        {codigo : 114  , nome : "Cartão de crédito CARDBAN"             },
        {codigo : 115  , nome : "Cartão de crédito VALECARD"            },
        {codigo : 116  , nome : "Cartão de crédito Cabal"               },
        {codigo : 117  , nome : "Cartão de crédito Mais"                },
        {codigo : 118  , nome : "Cartão de crédito Avista"              },
        {codigo : 119  , nome : "Cartão de crédito GRANDCARD"           },
        {codigo : 120  , nome : "Cartão de crédito Sorocred"            },
        {codigo : 201  , nome : "Boleto Bradesco"                       },
        {codigo : 202  , nome : "Boleto Santander"                      },
        {codigo : 301  , nome : "Débito online Bradesco"                },
        {codigo : 302  , nome : "Débito online Itaú"                    },
        {codigo : 303  , nome : "Débito online Unibanco"                },
        {codigo : 304  , nome : "Débito online Banco do Brasil"         },
        {codigo : 305  , nome : "Débito online Banco Real"              },
        {codigo : 306  , nome : "Débito online Banrisul"                },
        {codigo : 307  , nome : "Débito online HSBC"                    },
        {codigo : 401  , nome : "Saldo PagSeguro"                       },
        {codigo : 501  , nome : "Oi Paggo"                              },
        {codigo : 701  , nome : "Depósito em conta - Banco do Brasil"   },
        {codigo : 702  , nome : "Depósito em conta - HSBC"              }
    ];

    pagseguro.getTipoTransacao = function(codigo){
        if(codigo === undefined){
            return tipoTransacao;
        }else{
            return tipoTransacao.filter(function(item){return item.codigo == codigo;});
        }
    };

    pagseguro.getStatus = function(codigo){
        if(codigo === undefined){
            return status;
        }else{
            return status.filter(function(item){return item.codigo == codigo;});
        }
    };

    pagseguro.getTipoPagamento = function(codigo){
        if(codigo === undefined){
            return tipoPagamento;
        }else{
            return tipoPagamento.filter(function(item){return item.codigo == codigo;});
        }
    };

    pagseguro.getIdentificadorPagamento = function(codigo){
        if(codigo === undefined){
            return identificadorPagamento;
        }else{
            return identificadorPagamento.filter(function(item){return item.codigo == codigo;});
        }
    };

    return pagseguro;     
}; 