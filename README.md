<h1 align="center">Visual Programming Interface for Graph Pattern Mining 👋</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000" />
  <a href="https://github.com/ricardoRodiani/vpl-fractal#readme" target="_blank">
    <img alt="Documentation" src="https://img.shields.io/badge/documentation-yes-brightgreen.svg" />
  </a>
  <a href="https://github.com/ricardoRodiani/vpl-fractal/graphs/commit-activity" target="_blank">
    <img alt="Maintenance" src="https://img.shields.io/badge/Maintained%3F-yes-green.svg" />
  </a>
</p>

> This work consists of developing a web interface that is fully capable of running MPG algorithms on a given input graph, making it possible to visualize the resulting subgraphs of each processing.

### 🏠 [Homepage](https://github.com/ricardoRodiani/vpl-fractal#readme)

## Requirements for running

1. Follow [Fractal](https://github.com/dccspeed/fractal/tree/vd_visualprog_experimental) install instructions
2. Follow [Apache Livy](https://livy.apache.org/get-started/) install instructions
3. Insert the follow lines on Spark CONF file (cd /path/to/spark/conf)
   > spark.jars.packages com.koloboke:koloboke-impl-jdk8:1.0.0,com.typesafe.akka:akka-remote_2.11:2.5.3
   > spark.master local[1]
   > spark.master.memory 2g
   > spark.driver.memory 2g
   > spark.worker.memory 2g

## Install

```sh
1. npm install
```

## Usage

```sh
npm run dev
cd ./frontned
npm run serve
cd /path/to/livy
./bin/livy-server
go to page localhost:3000
```

## Author

👤 **Ricardo Rodiani**

- Website: https://www.linkedin.com/in/ricardo-rodiani/
- Github: [@ricardoRodiani](https://github.com/ricardoRodiani)

## Show your support

Give a ⭐️ if this project helped you!

---

_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
