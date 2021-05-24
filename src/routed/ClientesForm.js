import { NativeSelect, TextField } from '@material-ui/core';
import { useState, useEffect } from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';

export default function ClientesForm() {

    const [cliente, setCliente] = useState({
        id: null,
        marca: '',
        modelo: '',
        cor: '',
        ano_fabricacao: (new Date()).getFullYear(), // ano corrente
        importado: false,
        placa: '',
        preco: 0
    })

    function years() {
        let result = []
        for (let i = (new Date()).getFullYear(); i >= 1900; i--) result.push(i)
        return result
    }

    function handleInputChange(event) {

        // FACILITANDO AO CRIAR CARRO NO REACT <-> BANCO:
        /* quando o nome de uma propriedade de um objeto aparece entre [],
            isso se chama 'propriedade calculada'. O nome da propriedade vai
            corresponder à avaliação da expressão entre os colchetes
            
            mas para isso dar certo é preciso que:
            o nome da propriedade do estado == id do componente (por exemplo o TextField aqui)
        */
        setCliente({ ...cliente, [event.target.id]: event.target.value })
    }

    return (
        <>
            <h1>cadastrar novo cliente</h1>
            <form>
                <TextField id="marca" label="Marca" placeholder="Digite a marca"
                    variant="filled" value={cliente.marca} onChange={handleInputChange} />

                <TextField id="modelo" label="Modelo" placeholder="Digite o modelo"
                    variant="filled" value={cliente.marca} onChange={handleInputChange} />

                <FormControl>
                    <InputLabel variant="filled" htmlFor="cor">Cor</InputLabel>
                    <NativeSelect id='cor' onChange={handleInputChange}>
                        <option value="Amarelo">Amarelo</option>
                        <option value="Azul">Azul</option>
                        <option value="Bege">Bege</option>
                        <option value="Branco">Branco</option>
                        <option value="Cinza">Cinza</option>
                        <option value="Dourado">Dourado</option>
                        <option value="Laranja">Laranja</option>
                        <option value="Marrom">Marrom</option>
                        <option value="Prata">Prata</option>
                        <option value="Preto">Preto</option>
                        <option value="Roxo">Roxo</option>
                        <option value="Verde">Verde</option>
                        <option value="Vermelho">Vermelho</option>
                    </NativeSelect>
                </FormControl>

                <FormControl>
                    <InputLabel variant="filled" htmlFor="cor">Fabricação</InputLabel>
                    <NativeSelect id="ano_fabricacao" label="Fabricação"
                        variant="filled" onChange={handleInputChange}>
                        {years().map(year => <option key={year} value={year}>{year}</option>)}
                    </NativeSelect>
                </FormControl>
                <div>
                    {JSON.stringify(cliente)}
                </div>
            </form>
        </>
    )
}