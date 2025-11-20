const treeData = {
    name: "Evolução dos Sistemas Integrados",
    children: [
        {
            name: "Contexto Atual",
            children: [
                { name: "Era da Hiperautomação" },
                { name: "Computação em Nuvem" },
                { name: "Inteligência Artificial (IA)" },
                { name: "Objetivo: De registradores para 'Cérebros Operacionais'" }
            ]
        },
        {
            name: "Soluções Inovadoras",
            children: [
                { 
                    name: "ERP Cloud",
                    children: [
                        { name: "Escalabilidade" },
                        { name: "Flexibilidade" },
                        { name: "Atualização Constante" }
                    ]
                },
                { 
                    name: "Composable ERP",
                    children: [
                        { name: "Arquitetura Modular" },
                        { name: "Best-of-breed (Melhores soluções)" },
                        { name: "Agilidade na adaptação" }
                    ]
                }
            ]
        },
        {
            name: "Tecnologias Emergentes",
            children: [
                { 
                    name: "RPA (Robotic Process Automation)",
                    children: [
                        { name: "Automação de tarefas repetitivas" },
                        { name: "Redução de erros" }
                    ]
                },
                { 
                    name: "IA / Machine Learning",
                    children: [
                        { name: "Análise Preditiva" },
                        { name: "Tomada de decisão proativa" }
                    ]
                },
                { 
                    name: "Big Data",
                    children: [
                        { name: "Visão 360º do negócio" },
                        { name: "Processamento de grandes volumes" }
                    ]
                },
                { 
                    name: "IoT (Internet das Coisas)",
                    children: [
                        { name: "Dados em tempo real" },
                        { name: "Manutenção Preditiva" }
                    ]
                }
            ]
        },
        {
            name: "Impactos nas 3 Esferas",
            children: [
                { 
                    name: "Experiência do Cliente (CX)",
                    children: [
                        { name: "Hiperpersonalização" },
                        { name: "Jornada fluida" }
                    ]
                },
                { 
                    name: "Gestão",
                    children: [
                        { name: "Decisões baseadas em fatos" },
                        { name: "Insights em tempo real" }
                    ]
                },
                { 
                    name: "Analista de Sistemas",
                    children: [
                        { name: "Novo papel: Arquiteto de Soluções" },
                        { name: "Integrador de Tecnologias" },
                        { name: "Foco em Governança e Segurança" }
                    ]
                }
            ]
        },
        {
            name: "Preparação Profissional",
            children: [
                { 
                    name: "Hard Skills (Técnicas)",
                    children: [
                        { name: "Arquitetura em Nuvem" },
                        { name: "Data Science e IA/ML" },
                        { name: "APIs e Microsserviços" }
                    ]
                },
                { 
                    name: "Soft Skills (Comportamentais)",
                    children: [
                        { name: "Visão de Negócio" },
                        { name: "Comunicação e Colaboração" },
                        { name: "Resolução de problemas complexos" }
                    ]
                }
            ]
        }
    ]
};

const margin = { top: 20, right: 90, bottom: 30, left: 90 },
      width = window.innerWidth,
      height = window.innerHeight;

const svg = d3.select("#chart-container").append("svg")
    .attr("width", width)
    .attr("height", height)
    .call(d3.zoom().on("zoom", (event) => {
        g.attr("transform", event.transform);
    }))
    .append("g")
    .attr("transform", "translate(" + 150 + "," + height / 2 + ")");

const g = svg.append("g");

let i = 0,
    duration = 750,
    root;

const treeMap = d3.tree().nodeSize([40, 250]); 

root = d3.hierarchy(treeData, function(d) { return d.children; });
root.x0 = height / 2;
root.y0 = 0;

update(root);

function collapse(d) {
  if(d.children) {
    d._children = d.children
    d._children.forEach(collapse)
    d.children = null
  }
}

function update(source) {
  const treeData = treeMap(root);

  const nodes = treeData.descendants(),
        links = treeData.links();

  nodes.forEach(function(d){ d.y = d.depth * 280}); 

  const node = g.selectAll('g.node')
      .data(nodes, function(d) { return d.id || (d.id = ++i); });

  const nodeEnter = node.enter().append('g')
      .attr('class', 'node')
      .attr("transform", function(d) {
          return "translate(" + source.y0 + "," + source.x0 + ")";
      })
      .on('click', click);

  nodeEnter.append('circle')
      .attr('class', 'node')
      .attr('r', 1e-6)
      .style("fill", function(d) {
          return d._children ? "#2196F3" : "#050505"; 
      });

  nodeEnter.append('text')
      .attr("dy", ".35em")
      .attr("x", function(d) {
          return d.children || d._children ? -13 : 13;
      })
      .attr("text-anchor", function(d) {
          return d.children || d._children ? "end" : "start";
      })
      .text(function(d) { return d.data.name; });

  const nodeUpdate = nodeEnter.merge(node);

  nodeUpdate.transition()
      .duration(duration)
      .attr("transform", function(d) { 
          return "translate(" + d.y + "," + d.x + ")";
      });

  nodeUpdate.select('circle.node')
      .attr('r', 8) 
      .style("fill", function(d) {
          return d._children ? "#2196F3" : "#050505";
      })
      .attr('cursor', 'pointer');

  const nodeExit = node.exit().transition()
      .duration(duration)
      .attr("transform", function(d) {
          return "translate(" + source.y + "," + source.x + ")";
      })
      .remove();

  nodeExit.select('circle')
      .attr('r', 1e-6);

  nodeExit.select('text')
      .style('fill-opacity', 1e-6);

  const link = g.selectAll('path.link')
      .data(links, function(d) { return d.target.id; });

  const linkEnter = link.enter().insert('path', "g")
      .attr("class", "link")
      .attr('d', function(d){
        const o = {x: source.x0, y: source.y0}
        return diagonal(o, o)
      });

  const linkUpdate = linkEnter.merge(link);

  linkUpdate.transition()
      .duration(duration)
      .attr('d', function(d){ return diagonal(d.source, d.target) });

  const linkExit = link.exit().transition()
      .duration(duration)
      .attr('d', function(d) {
        const o = {x: source.x, y: source.y}
        return diagonal(o, o)
      })
      .remove();

  nodes.forEach(function(d){
    d.x0 = d.x;
    d.y0 = d.y;
  });

  function diagonal(s, d) {
    return `M ${s.y} ${s.x}
            C ${(s.y + d.y) / 2} ${s.x},
              ${(s.y + d.y) / 2} ${d.x},
              ${d.y} ${d.x}`;
  }

  function click(event, d) {
    if (d.children) {
        d._children = d.children;
        d.children = null;
    } else {
        d.children = d._children;
        d._children = null;
    }
    update(d);
  }
}