import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export function MemoryGraph() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    // Clear any previous render
    d3.select(svgRef.current).selectAll("*").remove();

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    // Mock data for the Engineering Memory Graph
    const nodes = [
      { id: "API Upload", group: 1, radius: 25 },
      { id: "Auth Middleware", group: 2, radius: 15 },
      { id: "Rate Limit Pattern", group: 3, radius: 20 },
      { id: "ADR-012: Cache", group: 4, radius: 18 },
      { id: "Redis Client", group: 5, radius: 15 },
      { id: "User Model", group: 6, radius: 15 },
      { id: "Upload Tests", group: 7, radius: 15 },
      { id: "CI Pipeline", group: 8, radius: 20 },
      { id: "Debt: Old Auth", group: 9, radius: 15 },
    ];

    const links = [
      { source: "API Upload", target: "Auth Middleware" },
      { source: "API Upload", target: "Upload Tests" },
      { source: "API Upload", target: "User Model" },
      { source: "Rate Limit Pattern", target: "ADR-012: Cache" },
      { source: "Auth Middleware", target: "Rate Limit Pattern" },
      { source: "Rate Limit Pattern", target: "Redis Client" },
      { source: "Auth Middleware", target: "Debt: Old Auth" },
      { source: "Upload Tests", target: "CI Pipeline" },
    ];

    const simulation = d3.forceSimulation(nodes as any)
      .force("link", d3.forceLink(links).id((d: any) => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-400))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide().radius((d: any) => d.radius + 10));

    const svg = d3.select(svgRef.current)
      .attr("viewBox", [0, 0, width, height]);

    // Define colors for groups
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    // Draw links
    const link = svg.append("g")
      .attr("stroke", "#374151") // text-gray-700
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", 2);

    // Draw nodes
    const node = svg.append("g")
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("r", d => d.radius)
      .attr("fill", (d: any) => color(d.group))
      .attr("stroke", "#111827") // bg-gray-900
      .attr("stroke-width", 2)
      .call(drag(simulation) as any);

    // Add labels
    const label = svg.append("g")
      .selectAll("text")
      .data(nodes)
      .join("text")
      .attr("font-size", "12px")
      .attr("fill", "#9ca3af") // text-gray-400
      .attr("text-anchor", "middle")
      .attr("dy", d => d.radius + 15)
      .text(d => d.id);

    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node
        .attr("cx", (d: any) => d.x)
        .attr("cy", (d: any) => d.y);

      label
        .attr("x", (d: any) => d.x)
        .attr("y", (d: any) => d.y);
    });

    function drag(simulation: any) {
      function dragstarted(event: any) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      }
      
      function dragged(event: any) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      }
      
      function dragended(event: any) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
      }
      
      return d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
    }

    return () => {
      simulation.stop();
    };
  }, []);

  return (
    <div className="glass-panel flex-1 flex flex-col p-6">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-100">Engineering Memory Graph</h2>
        <p className="text-sm text-gray-400">pgvector + Neo4j mapping of repository context</p>
      </div>
      <div className="flex-1 bg-gray-950/50 rounded-xl border border-gray-800 overflow-hidden relative">
        <svg ref={svgRef} className="w-full h-full" />
        <div className="absolute top-4 right-4 bg-gray-900/80 p-3 rounded-lg border border-gray-700 text-xs text-gray-300">
          <p className="font-semibold mb-2">Legend</p>
          <div className="flex items-center gap-2 mb-1"><span className="w-3 h-3 rounded-full bg-[#1f77b4]"></span> Entrypoints</div>
          <div className="flex items-center gap-2 mb-1"><span className="w-3 h-3 rounded-full bg-[#ff7f0e]"></span> Components</div>
          <div className="flex items-center gap-2 mb-1"><span className="w-3 h-3 rounded-full bg-[#2ca02c]"></span> ADRs / Patterns</div>
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#d62728]"></span> Tech Debt</div>
        </div>
      </div>
    </div>
  );
}
