const fs=require('fs'),path=require('path');
const root=__dirname, pub=path.join(root,'public');
const css=fs.readFileSync(path.join(pub,'viewer.css'),'utf8');
const fragment=fs.readFileSync(path.join(pub,'model-fragment.html'),'utf8');
const offline=fragment.replace('https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js','three.min.js');
const html='<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>五层堡垒 · 交互三维模型</title><style>'+css+'\nbody{margin:0;padding:16px;background:var(--background);color:var(--foreground);font-family:system-ui,Microsoft YaHei,sans-serif}</style></head><body>'+offline+'</body></html>';
fs.writeFileSync(path.join(pub,'model.html'),html);
const offlineDir=path.join(root,'..','bunker-3d-offline');fs.mkdirSync(offlineDir,{recursive:true});
fs.writeFileSync(path.join(offlineDir,'打开三维堡垒.html'),html);
fs.copyFileSync(path.join(pub,'three.min.js'),path.join(offlineDir,'three.min.js'));
fs.writeFileSync(path.join(offlineDir,'使用说明.txt'),'双击“打开三维堡垒.html”，使用支持 WebGL 的现代浏览器，无需联网。\n鼠标左键拖动旋转，滚轮缩放，右键拖动平移。触屏单指旋转、双指缩放。方向键旋转，加减键缩放。\n选择整体或 B1–B5；楼层展开用于查看内部；点击房间或用下拉框选择房间，再点“聚焦所选空间”。双击房间也可聚焦。\nB1 无人机间位于重卡库与总控室之间，内设独立枪械储存隔间；B4 维修工坊也有一处。柜内只有外形展示，无内部构造。\n加厚顶部岩层，延长折线车道；黄色路线从无人机间经专用通道和货运升降段抵达室外起降点。岩层尺度为未标定示意，楼层展开间距不代表埋深。\n保存当前视角导出无文字标注的模型截图。导出 OBJ 保存当前可见部分，同时下载 MTL，保留分组名称与柜门透明度；若浏览器限制连续下载，请允许多文件下载。两个文件应放在同一目录。\n随包提供整体合层状态的 bunker.obj 和 bunker.mtl，可导入 Blender 等建模软件。\n模型为简化几何空间概念，不是精确复刻效果图。比例、埋深和容量未经核算，不可直接用于施工。\n');
fs.appendFileSync(path.join(offlineDir,'使用说明.txt'),'\n新增交互：进入第一人称后，拖动画面转头，WASD/方向键移动；手机使用画面下方的移动按钮。移动受墙体和主要设备阻挡，漫游范围为室内房间与走廊；上下层通过电梯定位切换。Escape 或退出按钮返回剖面。\n点击单件物品或使用物品下拉框，选择替换款式和配色，再点应用替换。近看物品可聚焦；恢复此物品可撤销该件修改。替换保存在本浏览器，不同步至其他设备。OBJ 导出包含当前替换。\n重卡库与无人机间加入实体隔墙和可开合门组，可点门或开合车库隔断门按钮查看；防爆等级未核算。\n');
fs.appendFileSync(path.join(offlineDir,'使用说明.txt'),'\n本次改造：B1 九车位车辆库（4辆重卡、2辆轻型及3辆重型越野车），总控与生活区共墙并由单人门直接连通，生活区收回前方走道面积。B4 仓储加深至原来的约2.38倍，四类仓储共108架；未换算成200年有效供给。初始合层显示，楼层展开可用于拆解查看。\n');
fs.appendFileSync(path.join(offlineDir,'使用说明.txt'),'\n连接修正：折线车道从车库左侧独立车辆门进入，整体和B1均显示车道；无人机室的公共通道、专用转运通道出口及转运通道进入货运升降机处设置隔离门。点击隔离门可开合，室内漫游靠近时自动开启，离开后关闭。\n');
fs.appendFileSync(path.join(offlineDir,'使用说明.txt'),'\n游戏交互：WASD移动；驾驶时W/S油门或倒车、A/D转向，空格刹车，F下车。先选择车辆再驾驶；后排越野车从车库左侧调度带绕出。E手动开常闭门或拿起近处物品，Q放下；游戏枪械左键射击，R换弹，B2训练区有靶标。可以点击锁定鼠标，也可拖动转头。\n电梯需走进轿厢后使用上一层/下一层；货运升降机同样在轿厢内操作，往返B1与地面。B1-B5两处楼梯可连续行走，卧室直接接入短应急连接。起降井植被盖板可开合。车辆改装选择防护外观、越野轮胎、补给架、辅助灯并应用，保存到当前浏览器。\n驾驶、枪械与射击均为虚构的轻量游戏模拟，非真实车辆或防弹工程性能。\n');
console.log('Standalone and offline viewer built.');

fs.appendFileSync(path.join(offlineDir,'使用说明.txt'),'\n建模深化：原创部件化低多边形模型，参考TaCZ枪械、Create工业设备与Immersive Vehicles车辆建模工作流。八类游戏枪械共16件，各有独立外形、弹匣容量和射击节奏。B4四类仓储的108架全部改为四层、每层五个包装位，共2160个可见包装位。\n弹药分装在B1无人机间、B4维修间的独立储存隔间，共48个可领取箱，分P手枪/冲锋枪弹、R步枪弹、S霰弹、D精确步枪弹、M支援枪弹。选箱后靠近按E或领取按钮；箱库存会减少，换弹消耗对应随身弹药。枪内弹药、箱存量和随身储备保存在本浏览器。包装位和虚拟弹药库存不表示真实保障年限。\n参考：https://tacwiki.mcma.club/gunpack/first_gun/\nhttps://github.com/Creators-of-Create/Create\nhttps://github.com/DonBruce64/MinecraftTransportSimulator/wiki/Pack-Making-Models-Model-Requirements\n本站模型为原创程序几何，未直接导入上述模组的模型或贴图。\n');

fs.appendFileSync(path.join(offlineDir,'使用说明.txt'),'\n近看细节：选择物品后点击“细节查看 / 返回空间”，进入单件物品的独立旋转视图，滚轮可近距离查看；再次点击或选择楼层返回空间。弹药箱可用“开合弹药箱盖”查看铰链、密封圈、内衬和分装托盘，空箱不显示弹药。车辆增加轮毂螺栓、镜面后视镜、雨刷与牵引环；设备增加表盘、刻度和旋钮；生活区补充键盘、纸笔、杯内液面、被褥缝线、厨具。枪械外部细节和第一人称支撑手、换弹时弹匣动作均为游戏展示。\n');

fs.appendFileSync(path.join(offlineDir,'使用说明.txt'),'\n材质与车体更新：混凝土、金属、皮革使用嵌入的实拍PBR颜色/法线/粗糙度贴图，离线打开无需联网。金属颜色贴图经过灰度处理以保留车辆自定义配色。车辆驾驶舱为空心车体，包含座椅、窗框、车柱、仪表台、中控、方向盘与后排；枪械重绘外部轮廓、护圈和弯曲弹匣，手枪增加射击时滑套动作。PBR贴图仅在网页中生效，OBJ/MTL导出仍保留基础颜色与透明度。\n贴图来源（CC0）：https://polyhaven.com/a/concrete_floor_worn_001\nhttps://polyhaven.com/a/blue_metal_plate\nhttps://polyhaven.com/a/brown_leather\n授权：https://polyhaven.com/license\n');

fs.appendFileSync(path.join(offlineDir,'使用说明.txt'),'\n第一人称枪械更新：右键按住瞄准（触屏用瞄准按钮）；V键或检视按钮旋转查看持枪外形。手部改为曲面手掌、弯曲手指、拇指、护垫与袖口，枪械使用独立近景投影与照明。拿起有举枪过渡；换弹分为伸手、抽出、回插和归位，完成才扣减备弹。手枪滑套、转轮外部弹巢、泵动护木和供弹箱单独运动。锁定鼠标后按住左键，或按住射击按钮，支持四类游戏自动枪持续射击。普通拖动模式仍用点击射击。枪械动作是网页游戏表现，未使用真实枪械操作数据或TaCZ动画资源。\n');

fs.appendFileSync(path.join(offlineDir,'使用说明.txt'),'\n海岛备用堡垒：原模型顶部新增深山、海岛和1000 km连接示意三个视图；进入默认海岛，拖动旋转、滚轮缩放，点击建筑查看用途，查看岛底剖面可显示地下五层和运输终端。岛面设计为中心单人居住与总控、九车位备用车库、无人机机库、温室、水务能源站、可收拢光伏、主入口前室、避风码头检疫仓；外围设置分段门区、连续围护、六座观察监控塔、离岸监测浮标和两段弧形防波堤。防护为围护与监控概念，不配置自动攻击陷阱。\n地下B1到达换乘与检疫，B2单人生活医疗总控备份，B3封装物资种子备件，B4水务储能备用机组，B5高速运输终端检修。运输主线采用双线示意，另有检修线；岛端分段隔离和应急停靠，远端与深山主堡垒相连。两地距离按用户设定为约1000公里；区域图为非比例示意，线路深度、沿线站距、速度及全线工程可行性均未核算。海岛当前支持旋转、剖面、点击建筑与导出，未实现海岛第一人称碰撞或1000公里实际驾驶。\n');

fs.appendFileSync(path.join(offlineDir,'使用说明.txt'),'\n海岛精细化：重新划定互不重叠的建筑台地，环路绕开车库、温室与光伏；不规则岩岸和坡地采用实拍草岩、海岸岩石PBR材质。建筑增加分格窗、实墙、坡屋顶、咬合肋、雨水槽、落水管、入口雨棚和台阶。港池采用坡面防波堤、护面石、系船柱和护舷；观察塔增加梯子护栏，植物采用批量曲面树冠。双击建筑可聚焦，地下剖面隐藏全部地表对象。\n新增CC0贴图：https://polyhaven.com/a/aerial_grass_rock\nhttps://polyhaven.com/a/coast_sand_rocks_02\n港口照片参考：https://showcase.city.fukuoka.lg.jp/photo/img1066\nhttps://www.havneguide.dk/en/havn/hirsholm-havn\n仅以真实港口和材质为参考，仍是虚构场景，未复刻真实地理地点。\n');
