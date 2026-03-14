# Como subir versões para GitHub e iniciar testes

## 1) Publicar branch
```bash
git push origin <sua-branch>
```

## 2) Abrir PR
- O CI em `.github/workflows/ci.yml` será executado automaticamente.
- Aguarde todos os checks (`lint`, `typecheck`, `test`, `build`).

## 3) Validar release local (opcional)
```bash
npm run release:check
```

## 4) Tag da versão
```bash
git tag v0.2.0
git push origin v0.2.0
```
