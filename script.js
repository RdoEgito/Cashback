function calcCashback() {
    const taxaCartao = 2.99 / 100
    const taxaParcelamento = 3.49 / 100
    const vCashback = Number(document.getElementById("cashback-value").value.replace(",", "."))

    let table = document.getElementsByClassName("table")[0]
    setIds(table)

    for (let i = 2; i < 13; i++) {
        let pCashback = Number(document.getElementById("cashback_" + i).value)
        let nParcelas = Number(document.getElementById("parcelas_" + i).innerHTML)
        let valorAlvo = vCashback / (pCashback / 100)
        let CF = taxaParcelamento / (1 - Math.pow(1 + taxaParcelamento, -nParcelas))
        let vBoleto = ((valorAlvo / nParcelas) / (CF)) / (1 + taxaCartao)
        let vParcela = vBoleto * (1 + taxaCartao) * CF
        let vCobrado = vParcela * nParcelas
        let worth = worthIt(vBoleto, vCobrado, vCashback)

        document.getElementById("vBoleto_" + i).innerHTML = convertToBrCurrency(vBoleto)
        document.getElementById("vCobrado_" + i).innerHTML = convertToBrCurrency(vCobrado)
        document.getElementById("vParcela_" + i).innerHTML = convertToBrCurrency(vParcela)

        if (worth.worthIt) {
            document.getElementById("valeaPena_" + i).innerHTML = "<strong>Ganho:</strong> " + convertToBrCurrency(worth.diff)
            document.getElementById("linha_"+i).className = "vale"

        } else {
            document.getElementById("valeaPena_" + i).innerHTML = "<strong>Perda:</strong> " + convertToBrCurrency(worth.diff)
            document.getElementById("linha_"+i).className = "naoVale"
        }
    }
}

function setIds(table) {
    for (let i = 1; i < table.rows.length; i++) {
        table.rows[i].id = "linha_" + table.rows[i].cells[1].innerHTML
        table.rows[i].cells[0].getElementsByTagName("input")[0].id = "cashback_" + table.rows[i].cells[1].innerHTML
        table.rows[i].cells[1].id = "parcelas_" + table.rows[i].cells[1].innerHTML
        table.rows[i].cells[2].id = "vBoleto_" + table.rows[i].cells[1].innerHTML
        table.rows[i].cells[3].id = "vCobrado_" + table.rows[i].cells[1].innerHTML
        table.rows[i].cells[4].id = "vParcela_" + table.rows[i].cells[1].innerHTML
        table.rows[i].cells[5].id = "valeaPena_" + table.rows[i].cells[1].innerHTML
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