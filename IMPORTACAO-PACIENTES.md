# Importação de Pacientes via CSV

## Como usar

1. Na página de Pacientes, clique no botão **"Importar CSV"** no canto superior direito
2. Selecione um arquivo CSV com os dados dos pacientes
3. O sistema irá importar automaticamente todos os pacientes válidos

## Formato do arquivo CSV

O arquivo deve estar no formato CSV (separado por vírgulas) com a seguinte estrutura:

### Cabeçalho (primeira linha)

O arquivo deve conter um cabeçalho com os nomes das colunas. Os seguintes nomes são aceitos (em português ou inglês):

- **nome** ou **name** (obrigatório)
- **idade** ou **age** (opcional)
- **genero**, **gênero** ou **gender** (opcional)
- **telefone** ou **phone** (opcional)
- **email** ou **e-mail** (opcional)
- **endereco**, **endereço** ou **address** (opcional)
- **observacoes**, **observações** ou **notes** (opcional)

### Valores aceitos para gênero

- `masculino`, `male` ou `m`
- `feminino`, `female` ou `f`
- `outro` ou `other`

### Exemplo de arquivo

Veja o arquivo `exemplo-pacientes.csv` na raiz do projeto para um exemplo completo.

```csv
nome,idade,genero,telefone,email,endereco,observacoes
João Silva,45,masculino,(11) 98765-4321,joao.silva@email.com,Rua das Flores 123 São Paulo SP,Hipertenso há 5 anos
Maria Santos,32,feminino,(21) 91234-5678,maria.santos@email.com,Av. Principal 456 Rio de Janeiro RJ,Alérgica a penicilina
```

## Validações

- O campo **nome** é obrigatório e deve ter pelo menos 3 caracteres
- Campos vazios serão ignorados
- Pacientes com nome inválido serão contabilizados como erro

## Resultado da importação

Após a importação, o sistema exibirá uma mensagem com:
- Número de pacientes importados com sucesso
- Número de registros com erro (se houver)

## Dicas

- Use codificação UTF-8 para evitar problemas com acentuação
- Certifique-se de que não há quebras de linha dentro dos campos
- Valores com vírgulas devem estar entre aspas duplas
