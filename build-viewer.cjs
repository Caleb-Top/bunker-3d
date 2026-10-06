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

fs.appendFileSync(path.join(offlineDir,'使用说明.txt'),'\n堡垒周界和内港更新：原离散低墙替换为沿地形连续连接的混凝土厚墙、墙顶检修平台、实心女儿墙、外侧扶壁、钢覆面板和车辆门楼。C1000是用户指定的虚构材料等级，未定义真实材料配方、强度或防护性能；现实UHPC参考：https://www.fhwa.dot.gov/publications/research/infrastructure/structures/11038/ 。\n新增岛内封闭潜艇港：海上入口、两段可开合闸门、海水港池、两侧检修码头、护舷、系船柱、吊装架、岸电设备与民用潜航器外形。查看潜艇内港按钮隐藏岛面与顶盖，可旋转近看；闸门按钮展示开合，返回海岛总览恢复。内港与地下五层占地分开，全部尺度为未核算游戏概念，无潜艇驾驶或真实水动力模拟。\n');

fs.appendFileSync(path.join(offlineDir,'使用说明.txt'),'\n内港隐蔽修正：移除伸向海上的长廊与外露入口建筑，港池缩进岛体内部；接近段从水下岩壁口进入，双闸门均收回岛内。恢复原海岸网格，海岛总览不显示地下港体、顶盖和闸门。查看潜艇内港时揭开岛面与顶盖，返回总览恢复覆盖；无突出岛外的港口建筑。仅为空间展示，未模拟水下航行与真实工程性能。\n');

fs.appendFileSync(path.join(offlineDir,'使用说明.txt'),'\n整体海岛堡垒：原六处独立功能建筑收进同一连续基座、外墙和顶板，采用四角高起塔体、封闭屋顶和钢构入口的整体造型。参考柏林Humboldthain高射炮塔的建筑体量：https://www.berliner-unterwelten.de/en/the-association/projects/humboldthain-flak-tower.html ，未复刻历史结构或武器配置。光伏移至堡垒外北侧，三座风力发电外观模型位于岛面。查看堡垒内部按钮揭开统一外壳显示生活总控、九车位、无人机、水务、种植和地下入口；潜艇内港保持隐蔽。内嵌机枪防卫点仅是虚构游戏外观，可切换盖板与外观展示，不含目标识别、自动瞄准或开火功能。\n');

fs.writeFileSync(path.join(offlineDir,'使用说明.txt'),"打开三维堡垒.html 支持 WebGL 浏览器离线运行。左键拖动旋转、滚轮缩放、右键平移；触屏单指旋转、双指缩放。\n海岛：查看堡垒内部揭开外壳，显示九车位、无人机、维修、总控、单人卧室、枪械外观改装、设备储备、侧后方地下入口和种子菌种间。堡垒缩至初始平面尺寸70%，四角增加1130风格游戏外观。种植庭院移至岛面，光伏共用平整台地，岛面四台风机。\n检疫小港重做泊位与门，放置两艘快艇。厚墙共用连续中心线高度，外层防攀爬围栏可切换电网特效；海底信标可单独查看。机炮动画为三秒旋转炮管和闪光演示，无目标识别、伤害或真实射击参数。\n岛底五层：B1备用生活、医疗及到达检疫；B2食品和生活耗材储物；B3设备、零件及封装物资储物；B4十台大型备用机组、净水储水及空气处理；B5连接分段隔离隧道，另留待定空间。打开岛底剖面后，可用海岛地下层菜单逐层查看。\n海岛枪械区有八类外观，选择涂装、木质家具或光学瞄具外观后应用，近看按钮进入独立旋转视图，再次点击返回。当前海岛外观修改保留在会话；深山物品替换保存在当前浏览器。\n潜艇内港隐于岛体。查看潜艇内港后进入潜艇，拖动转头，WASD移动，靠近舱门按E或开合舱门按钮。舱内有控制台、铺位、餐区与装饰设备。驾驶潜艇时W/S推进、A/D在开放海面转向；出港航行和返回内港按钮走固定游戏路径，闸门渐开，显示模拟速度、动力比例和深度。离开潜艇返回外观视图。核动力只是虚构叙事，无反应堆模拟或真实水动力。\n海岛门组、内港闸门和潜艇舱门均渐变开合。岛体补充岩质基底，码头支柱延伸至海床。\n深山：B1九车位含4重卡、2轻型及3重型越野车，B4共108架2160包装位；8类16件游戏枪械和48箱有限弹药。进入第一人称，WASD移动、E拿取开门、F驾驶下车、Q放下、R换弹、V检视、右键瞄准。选择车辆可改外观，折线车道可开到地表。应急楼梯连通B1-B5与地表，卧室有短应急连接；电梯需走入轿厢后操作，货梯往返B1和地表。\n保存当前视角导出截图。OBJ+MTL导出当前可见对象，允许浏览器连续下载并将两文件放同目录；只保留颜色透明度，无PBR贴图动画。随包bunker.obj/bunker.mtl为深山整体静态模型，网页含深山和海岛。\n全部为原创程序几何与轻量游戏，无真实武器、核动力、高压设备工程实现。C1000为虚构等级，比例、埋深、200年保障、1000公里线路可行性未核算，不用于施工；海岛堡垒无完整第一人称碰撞，潜艇舱内有简化碰撞。\n外形参考：HK官方产品目录 https://hk-usa.com/wp-content/uploads/HK-USA-MILITARY-LE-COMBINED-CATALOG1.pdf ，GLOCK https://gen5.glock.us/g17/ ，潜艇博物馆 https://ussnautilus.org/scavenger-hunts/ ，柏林塔体 https://www.berliner-unterwelten.de/en/the-association/projects/humboldthain-flak-tower.html 。仅参考公开外形与舱室布局，未导入模型。\nMC工作流参考：TaCZ https://tacwiki.mcma.club/gunpack/first_gun/ ，Create https://github.com/Creators-of-Create/Create ，Immersive Vehicles https://github.com/DonBruce64/MinecraftTransportSimulator/wiki/Pack-Making-Models-Model-Requirements 。未直接使用模组资源。\n嵌入实拍PBR贴图CC0：PolyHaven concrete_floor_worn_001、blue_metal_plate、brown_leather、aerial_grass_rock、coast_sand_rocks_02，https://polyhaven.com/license 。Three.js授权见随包许可。\n");

fs.appendFileSync(path.join(offlineDir,'使用说明.txt'),"\n光伏修正：放缓北侧台地坡面，12组面板与细分格共用倾斜框架，统一支架、底脚、平整混凝土基座和埋入基础。\n");

fs.appendFileSync(path.join(offlineDir,'使用说明.txt'),"\n本次布局：堡垒重新建模为紧凑两层厚壁外壳、斜面基座、规整扶壁分缝；地上二层功能待定，可单独查看。正门为与堡垒贴合的双门缓冲厅，检疫门按无缩放父组重建。四台风机向岛内移，叶片避开围墙。道路重接检疫门、正门、光伏和种植庭院。\n内部合并为车辆维修、无人机准备、生活总控、枪械改装补给、设备水气五个主要区。生活区有直达地下的门与连续旋转楼梯。车辆升降机可选择九辆车之一装载，下降至B5；驶入B5分段隧道为固定路线游戏转运，返回地面会原路回到升降机并上升。未模拟完整1000公里行驶。\n潜艇缩至约50游戏长度单位，单人铺位、书桌、厨餐、卫生、医药、水务外观、大量封装物资与八类枪械外观柜。驾驶视角可切换第三人称、第一人称外部视野、控制室实时外部监视屏。出港后R或下潜按钮增加目标深度，F或上浮减小，简化游戏深度范围4至18；港内遵循预设通道深度，自动出港返航按固定路线。核动力、武器和电网仍为虚构表现。\n外观参考：Stuart White电影堡垒概念 https://stuartwhite.artstation.com/projects/rReoaL ，柏林Humboldthain体量 https://www.berliner-unterwelten.de/en/the-association/projects/humboldthain-flak-tower/restoration.html ，仅参考形态，未导入作者模型或图片。\n");

fs.appendFileSync(path.join(offlineDir,'使用说明.txt'),"\n内饰新增：生活区铺面与地毯、床边暖灯、收纳柜与书籍、沙发抱枕和茶几；维修物资区增设规整标识。潜艇舱统一墙面、顶板、灯具、地面防滑带，添加床品、桌椅支撑、厨餐用品、急救与卫生收纳。保持通道中央可用。\n");

fs.appendFileSync(path.join(offlineDir,'使用说明.txt'),"\n深山地表与正门更新：点击深山主堡垒，再点地表与正门或近看深山正门。连续岩土坡面、实拍PBR材质、分枝针叶树林与碎石边坡替换原绿色平板和锥形树。原四道折线车道门和驾驶路线保留，正门沿车道末段方向嵌入山体门厅，增加挡土翼墙、厚双扇滑门、锁闭外观、轨道、沟槽与照明；打开深山正门可查看动画。总览视角回到地下剖面，取消深埋岩层可隐藏地表。公开外观参考 https://en.sasso-sangottardo.ch/ ，原创游戏场景，未复刻真实结构。\n");

fs.appendFileSync(path.join(offlineDir,'使用说明.txt'),"\n入口隐蔽外观更新：混凝土门脸、门厅顶板与两侧墙体增加岩土和本地植被覆盖；双扇门外侧增加连续岩壁表面，随原门扇一起开合。进场面采用与地形同尺度岩土贴图，移除明亮道路边线。近看深山正门后开门可查看岩面退入两侧的动画；车辆仍沿原四道折线隔离门驶出。为虚构游戏美术，无真实隐蔽性能验证。\n");

fs.appendFileSync(path.join(offlineDir,'使用说明.txt'),"\n一体伪装更新：移除入口装饰石块门框和大型环绕植被，固定山壁与两扇活动岩面共用连续表面函数和空间投影贴图。关门时岩壁起伏、纹理延续至两側山体；打开深山正门露出原通行门洞。入口后方取消低洼门厅地形与过长地表缺口，补为向山体延伸的连续坡面，修复坡顶与坡脚连接。明亮边线及两排碎石痕迹隐藏，起降井与应急出口原高度保留。游戏美术与简化交互，无现实伪装性能验证。\n");

fs.appendFileSync(path.join(offlineDir,'使用说明.txt'),"\n无人机起降口更新：取消井口周围的方形低洼平台，保留原始连续坡面；双侧盖板使用同一地形高度与空间贴图，关闭时与周围地表衔接。盖板独立于转运路线显隐，收回时先降低再退入两侧。延长升降导轨，并将货运升降机到达高度改为坡面高度；井壁上沿跟随坡面，避免金属边角穿出地表。近看无人机起降口后可使用隐蔽起降井：开合按钮查看。\n");

fs.appendFileSync(path.join(offlineDir,'使用说明.txt'),"\n2026-10-06 海岛整体改造：堡垒平面比例由0.70收为0.62，保留两层外壳，东侧增加小平整庭院。围墙/电网向岛内收回，平滑核心台地，4台陆上风机地形基础落地；新增4台更远海上的三叶风机、海底基脚与展示电缆。外形参考明阳当前官方MySE18.5-260 https://mingyang.com/products/offshore/18-5-260/ ，抗台风外形背景参考厂家公开台风报告 https://en.myse.com.cn/news/info.aspx?itemid=2527 ，尺寸和性能均为游戏展示，未套用真实工程参数。\n内港为岛体西北侧地下设施，不是独立露天港；查看内港入口连接可见生活区楼梯—B1内部前室—内港码头的连接。两道闸门统一无缩放结构，检修岸台、护舷、护栏、登艇桥加入细节。重建返折楼梯并移除旧叠加台阶和薄片立柱，各层房门改向内部大厅，B2/B3仍为储物、B4保留10机组及水气处理、B5仍接分段运输终端。\n四角机炮外观放大并加入舱罩、雷达、转管托架和散热细节。车辆维修区后侧增设机器人改装工坊：3具原创持枪人形游戏模型、展示台、工具台及配色选择；身体外观参考公开Unitree G1 https://www.unitree.com/g1/ ，未称其为真实武装产品。\n潜艇返航先在港外对齐再倒车靠泊，修正航点深度导致的停滞；进入驾驶重置视线，离艇取消航程；舱内屏幕显示实时外部视野，下潜改变深度与水下画面。第三人称、艇首第一人称、控制室视角均可选，W/S推进A/D海上转向，R下潜F上浮。海岛车辆升降仍为从地面至B5的游戏转运，可装载9辆中的任一辆，驶入分段隧道并返回。\n");

fs.appendFileSync(path.join(offlineDir,'使用说明.txt'),"\n1000公里通道新版：区域图显示独立双向双车道公路管廊、单线高速轨道管廊和检修疏散廊。K0/K250/K500/K750/K1000是非比例分段节点，未设定实际站距与工程参数。点击近看路轨通道进入海岛B5样段，再用揭开/合上隧道顶盖查看衬砌、双向车道、板式轨道、接触线外观、检修步道、线缆、水务管线和六处横向联络口。公路、轨道及检修廊分别设置分段门；新增个人流线轨道运输车外观，单线按交替方向运行的游戏设定。公路转运沿左侧车道行进并保持9辆车升降往返。样段为115游戏单位，未实现1000公里真实驾驶或列车驾驶。外观布局参考Getlink英法隧道 https://www.getlinkgroup.com/en/our-group/eurotunnel/channel-tunnel/ ，未照搬尺寸、深度或性能。\n视图与交互修复：126种交叉视图切换、潜艇舱内家具碰撞与侧向绕行、门口占用保护、深水返航平滑升降、手动出港及退出瞄准状态复位。\n");

fs.appendFileSync(path.join(offlineDir,'使用说明.txt'),"\n2026-10-07 细节深化：隧道曲面增加连续UV和向内法线，顶盖剖开同步隐藏接缝与接触网支架；补充衬砌紧固件、线缆支架、轨道扣件、排水格栅、门框与运输车外观。堡垒外墙分缝、屋面收边、室内踢脚线、灯具、机组检修盖、车辆底盘、潜艇舱内管线和码头格栅均在原部件上增加细节。无人机电机、机器人壳体、快艇甲板和枪械外观补充近景件；小装饰合并缓冲，不加入行走碰撞。保留原门组动画、车辆往返和潜艇驾驶；完整1000公里仍为线路示意与端部样段。\n");

fs.appendFileSync(path.join(offlineDir,'使用说明.txt'),"\n电动牵引辅助：双向公路中央增加近乎齐平的窄导轨、分段标识和绝缘外观；原两侧车道与独立高速铁轨保留。海岛车辆升降机菜单中可切换电动牵引辅助，装载车辆、下降B5再驶入分段隧道；车辆进入直线段后，滑块和连接臂跟车，车辆动力显示待机。关闭辅助后回到游戏自驱；离开牵引段、停车和返到升降机时断开连接。采用缓慢连续牵引的游戏表现，不模拟电磁弹射高加速度，也没有现实能耗或节油率核算。\n");
