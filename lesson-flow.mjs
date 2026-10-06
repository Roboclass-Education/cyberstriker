export let assemblySteps=[],prepSteps=[];
export function configureFlows(assembly,prep){assemblySteps=assembly;prepSteps=prep;}
export function flowItems(mode,groups,wood=[]){return mode==='assembly'?assemblySteps:mode==='prep'?prepSteps:mode==='wood'?wood:groups.filter(g=>g.category!=='wood');}
export function visibleGroupIds(mode,active,isolated,groups,wood=[]){const items=flowItems(mode,groups,wood),current=items[active];if(mode==='wood')return current?[current.id]:[];if(isolated&&current)return current.focus||[current.id];if(mode==='assembly'||mode==='prep')return current?.visible||[];return groups.filter(g=>g.category!=='wood').map(g=>g.id).concat('sensor-cables');}
export function validateStep(step,items){if(!Number.isInteger(step)||step<1||step>items.length)throw Error('Ongeldige stap');return step-1;}
