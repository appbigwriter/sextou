# Executar Migrações no Servidor

## Método 1: Via EasyPanel (Mais fácil)

### Passo a passo:

1. **Acesse o EasyPanel**
   - Faça login no painel do EasyPanel

2. **Abra o Terminal do App**
   - Vá em **Apps** → **sexta-empreendedor**
   - Clique em **Terminal** ou **Console**

3. **Execute o comando:**
   ```bash
   npx prisma db push
   ```

4. **Verifique o resultado**
   - Deve mostrar "✅ Everything is up to date" ou listar tabelas criadas

---

## Método 2: Via SSH/Docker

### Se tiver acesso SSH ao servidor:

```bash
# Acessar o container
docker exec -it sexta-empreendedor sh

# Dentro do container, executar migração
npx prisma db push

# Sair
exit
```

---

## Método 3: Via EasyPanel Database (Se disponível)

1. Vá em **Databases** → **sextadoempreendedor**
2. Clique em **Connect** ou **SQL Console**
3. Execute o SQL diretamente (menos recomendado para Prisma)

---

## Após as migrações

1. **Verificar se as tabelas foram criadas:**
   ```bash
   npx prisma studio
   ```
   (abre interface visual para ver o banco)

2. **Opcional: Criar dados iniciais (seed):**
   ```bash
   npx prisma db seed
   ```
   (se houver seed configurado)

---

## Troubleshooting

### Erro: "Can't reach database server"
- O banco está em rede interna do Docker
- Use o método via Terminal do EasyPanel

### Erro: "Database is not empty"
- O banco já tem tabelas
- Use `npx prisma migrate deploy` em vez de `db push`

### Sucesso!
- O app está pronto para uso
- Acesse `/api/health` para testar