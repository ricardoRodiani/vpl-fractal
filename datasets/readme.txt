citeseer.graph: vertices representam publicações acadêmicas e arestas
representam citações entre essas publicações, rótulos nos vértices representam
áreas de pesquisa em Ciência da Computação. Obs. não existe mapeamento de
rótulos para nomes de áreas, portanto, as análises devem ser feitas levando isso
em consideração.

mico.graph: vértices representam autores da base de dados da Microsoft Research
e arestas indicam dois autores sendo co-autores em algum artigo, rótulos nos
vértices representam áreas de interesse de pesquisa desses autores. Obs. assim
como citeseer, não existe mapeamento de números para nomes de área específicos,
portanto, as análises devem levar isso em consideração.

mico e citeseer devem ser citadas usando a seguinte referência:

@Article{elseidy2014grami,
  author     = {Elseidy, Mohammed and Abdelhamid, Ehab and Skiadopoulos, Spiros and Kalnis, Panos},
  title      = {GraMi: Frequent Subgraph and Pattern Mining in a Single Large Graph},
  journal    = {Proc. VLDB Endow.},
  year       = {2014},
  volume     = {7},
  number     = {7},
  pages      = {517--528},
  month      = mar,
  issn       = {2150-8097},
  acmid      = {2732289},
  doi        = {10.14778/2732286.2732289},
  issue_date = {March 2014},
  numpages   = {12},
  publisher  = {VLDB Endowment},
  url        = {http://dx.doi.org/10.14778/2732286.2732289},
}

facebook.graph: vértices representam páginas verificadas do Facebook e arestas
representam "likes" mútuos entre duas páginas, rótulos representam a categoria
das páginas (0: company, 1: government, 2: politician, 3: tvshow). Várias
análises envolvendo subgrafos podem ser feitas usando essas categorias.

https://snap.stanford.edu/data/facebook-large-page-page-network.html

facebook deve ser citada usando a seguinte referência:

@misc{rozemberczki2019multiscale,
   title={Multi-scale Attributed Node Embedding},
   author={Benedek Rozemberczki and Carl Allen and Rik Sarkar},
   year={2019},
   eprint={1909.13021},
   archivePrefix={arXiv},
   primaryClass={cs.LG}
}
