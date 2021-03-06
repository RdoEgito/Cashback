let table = document.getElementsByClassName("table")[0]
let radio_cashbackMaximo = document.getElementById("radio_cashbackMaximo")
let radio_valorEspecifico = document.getElementById("radio_valorEspecifico")
let valorEspecifico = document.getElementById("valorEspecifico")
let vMaxCashback = document.getElementById("cashback-value")
let vMaxBoleto = document.getElementById("boleto-max-value")

function calcCashback() {
    const taxaCartao = 2.99 / 100
    const taxaParcelamento = 3.49 / 100
    let vCashback, pCashback, nParcelas, valorAlvo, CF, vBoleto, vParcela, vCobrado, worth
    setIds(table)

    for (let i = 2; i < 13; i++) {
        // Calcular valores
        let pCashback = Number(document.getElementById("cashback_" + i).value)
        let nParcelas = Number(document.getElementById("parcelas_" + i).innerHTML)
        let CF = taxaParcelamento / (1 - Math.pow(1 + taxaParcelamento, -nParcelas))

        if (radio_cashbackMaximo.checked) {
            vCashback = Number(vMaxCashback.value)
            let valorAlvo = vCashback / (pCashback / 100)
            vBoleto = ((valorAlvo / nParcelas) / (CF)) / (1 + taxaCartao)
            vParcela = vBoleto * (1 + taxaCartao) * CF
            vCobrado = vParcela * nParcelas
            if (vBoleto > Number(vMaxBoleto.value)) {
                vBoleto = Number(vMaxBoleto.value)
                vParcela = vBoleto * (1 + taxaCartao) * CF
                vCobrado = vParcela * nParcelas
                vCashback = vCobrado * (pCashback / 100) < vMaxCashback.value ? vCobrado * (pCashback / 100) : Number(vMaxCashback.value)
            }

            Array.prototype.slice.call(document.querySelectorAll("table tr>*:nth-child(4)")).map(x => x.style.display = "table-cell")
            Array.prototype.slice.call(document.querySelectorAll("table tr>*:nth-child(5)")).map(x => x.style.display = "none")
        } else if (radio_valorEspecifico.checked) {
            vBoleto = Number(valorEspecifico.value)
            vParcela = vBoleto * (1 + taxaCartao) * CF
            vCobrado = vParcela * nParcelas
            vCashback = vCobrado * (pCashback / 100) < vMaxCashback.value ? vCobrado * (pCashback / 100) : Number(vMaxCashback.value)

            // console.log(vBoleto, vCobrado, vCashback)

            Array.prototype.slice.call(document.querySelectorAll("table tr>*:nth-child(5)")).map(x => x.style.display = "table-cell")
            Array.prototype.slice.call(document.querySelectorAll("table tr>*:nth-child(4)")).map(x => x.style.display = "none")
        }
        worth = worthIt(vBoleto, vCobrado, vCashback)

        // Preencher tabela
        document.getElementById("vBoleto_" + i).innerHTML = convertToBrCurrency(vBoleto)
        document.getElementById("vCashback_" + i).innerHTML = convertToBrCurrency(vCashback)
        document.getElementById("vCobrado_" + i).innerHTML = convertToBrCurrency(vCobrado)
        document.getElementById("vParcela_" + i).innerHTML = convertToBrCurrency(vParcela)

        if (worth.worthIt) {
            document.getElementById("valeaPena_" + i).innerHTML = "<strong>Ganho:</strong> " + convertToBrCurrency(worth.diff)
            document.getElementById("linha_" + i).className = "vale"

        } else {
            document.getElementById("valeaPena_" + i).innerHTML = "<strong>Perda:</strong> " + convertToBrCurrency(worth.diff)
            document.getElementById("linha_" + i).className = "naoVale"
        }
    }
}

function selecionarValorEspecifico() {
    radio_valorEspecifico.checked = true
    calcCashback()
}

function setIds(table) {
    const columns = {
        cashback: 0,
        parcelas: 1,
        valeaPena: 2,
        vBoleto: 3,
        vCashback: 4,
        vCobrado: 5,
        vParcela: 6
    }
    for (let i = 1; i < table.rows.length; i++) {
        table.rows[i].id = "linha_" + table.rows[i].cells[1].innerHTML
        table.rows[i].cells[columns.cashback].getElementsByTagName("input")[0].id = "cashback_" + table.rows[i].cells[1].innerHTML
        table.rows[i].cells[columns.parcelas].id = "parcelas_" + table.rows[i].cells[1].innerHTML
        table.rows[i].cells[columns.vBoleto].id = "vBoleto_" + table.rows[i].cells[1].innerHTML
        table.rows[i].cells[columns.vCashback].id = "vCashback_" + table.rows[i].cells[1].innerHTML
        table.rows[i].cells[columns.vCobrado].id = "vCobrado_" + table.rows[i].cells[1].innerHTML
        table.rows[i].cells[columns.vParcela].id = "vParcela_" + table.rows[i].cells[1].innerHTML
        table.rows[i].cells[columns.valeaPena].id = "valeaPena_" + table.rows[i].cells[1].innerHTML
    }
}

function convertToBrCurrency(v) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)
}

function worthIt(vRecebido, vPago, vCashback) {
    if (vRecebido + vCashback > vPago) return {
        worthIt: true,
        diff: (vRecebido + vCashback) - vPago
    }
    else return {
        worthIt: false,
        diff: vPago - (vRecebido + vCashback)
    }
}

calcCashback()