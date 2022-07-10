from socket import timeout
from time import sleep
from rest_framework.response import Response
from rest_framework.decorators import api_view
from livy import *
import textwrap

LIVY_URL = "http://localhost:8998"


@api_view(['GET'])
def getData(request):
    batch = LivyBatch.create(
        LIVY_URL,
        class_name="br.ufmg.cs.systems.fractal.FractalSparkRunner",
        args=[
            "al",
            "/home/unix/libs_tcc/fractal/data/citeseer-single-label.graph",
            "cliques",
            "scratch",
            "1",
            "2",
            "info"
        ],
        driver_memory="2g",
        executor_memory="2g",
        num_executors=1,
        executor_cores=1,
        file="local:/home/unix/libs_tcc/fractal/fractal-core/build/libs/fractal-core-SPARK-2.2.0.jar"
    )
    batch.wait()
    return Response(data=batch.log(0))
    # status = 200 if batch.state == "success" else 404
    # with LivySession.create(
    #     LIVY_URL,
    #     kind=SessionKind.SPARK,
    #     files=[
    #         "local:/home/zxc/libs_tcc/fractal/data/citeseer-single-label.graph"
    #     ],
    #     spark_conf={
    #         "spark.driver.extraClassPath": "/home/zxc/libs_tcc/fractal/fractal-core/build/libs/fractal-core-SPARK-2.2.0.jar"
    #     }
    # ) as session:

    #     code = 'val fc = new FractalContext(sc)'
    #     res = session.run(code=code)
    #     session.wait()
    #     sleep(60)
    #     return Response(data=res.text)
