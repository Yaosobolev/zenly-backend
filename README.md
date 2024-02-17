# Backend-zenly

## 1) Init project

#### 1) `yarn init -y`

#### 2) `yarn add @prisma/client express`

#### 3) `yarn add --dev @types/express @types/node nodemon prisma ts-node typescript`

### 1) Create scripts

```
"scripts": {
    "dev": "nodemon src/index.ts",
    "migrate": "prisma migrate dev"
},
```

### 2) Create and settings

```
{
  "compileOnSave": false,
  "compilerOptions": {
    "target": "es2017",
    "lib": ["es2017", "esnext.asynciterable"],
    "typeRoots": ["node_modules/@types"],
    "allowSyntheticDefaultImports": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "node",
    "module": "commonjs",
    "pretty": true,
    "sourceMap": true,
    "declaration": true,
    "outDir": "dist",
    "allowJs": true,
    "noEmit": false,
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "baseUrl": "src"
  },
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules"]
}

```

### 3) Init PostgreSQL

```
npx prisma init --datasource-provider postgresql
```

### 4) Init Schema and enter a name for the new migration: zenly_db

```
npx prisma init --datasource-provider postgresql
```

## 2) Run project `yarn dev`
