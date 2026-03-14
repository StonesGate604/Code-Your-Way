let points = [];
let nPoints = 145; 
let bgGraphics;    
let time = 0;      
let baseImg;       // 新增：用于存储你的图片源文件

// ========================================================
// 新增：preload 函数会在 setup 之前运行，确保图片加载完成
// ========================================================
function preload() {
  // 请将这里的 'your-image.jpg' 替换为你实际的图片文件名或路径
  // 建议图片和这个 js 文件放在同一个文件夹内
  baseImg = loadImage('image.jpg'); 
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // ========================================================
  // 1. 修改：将你的图片绘制到底层虚拟画布上
  // ========================================================
  bgGraphics = createGraphics(width, height);
  // 使用 image() 函数，把载入的图片拉伸铺满整个屏幕大小
  bgGraphics.image(baseImg, 0, 0, width, height);
  
  // 💡 可选小技巧：如果你的原图细节太碎，会导致三角形闪烁太厉害。
  // 可以解开下面这行代码的注释，给底图加一点点模糊，效果会更高级：
  // bgGraphics.filter(BLUR, 15); 

  // ========================================================
  // 2. 初始化网格顶点与噪声种子 (保持不变)
  // ========================================================
  for (let i = 0; i < nPoints; i++) {
    points.push({
      x: random(0, width),
      y: random(0, height),
      seedX: random(1000), 
      seedY: random(1000)  
    });
  }
}

function draw() {
  background(245);
  
  let currentPoints = [];
  let moveRange = 150; 
  
  // 3. 计算本帧点的漂移位置
  for (let p of points) {
    let nx = p.x + map(noise(p.seedX + time), 0, 1, -moveRange, moveRange);
    let ny = p.y + map(noise(p.seedY + time), 0, 1, -moveRange, moveRange);
    currentPoints.push([nx, ny]);
  }

  let margin = 100; 
  currentPoints.push(
    [-margin, -margin], [width+margin, -margin], 
    [-margin, height+margin], [width+margin, height+margin],
    [width/2, -margin], [width/2, height+margin], 
    [-margin, height/2], [width+margin, height/2]
  );

  // 4. 执行 Delaunay 实时三角剖分
  let delaunay = Delaunator.from(currentPoints);
  let triangles = delaunay.triangles;

  let spotlightRadius = 350;           
  let fogColor = color(245, 245, 245); 

  // 5. 绘制三角形并处理视觉特效
  for (let i = 0; i < triangles.length; i += 3) {
    let p1 = currentPoints[triangles[i]];
    let p2 = currentPoints[triangles[i + 1]];
    let p3 = currentPoints[triangles[i + 2]];

    let cx = (p1[0] + p2[0] + p3[0]) / 3;
    let cy = (p1[1] + p2[1] + p3[1]) / 3;

    let sampleX = constrain(cx, 0, width - 1);
    let sampleY = constrain(cy, 0, height - 1);
    
    // 这里依然是从 bgGraphics 采样，但 bgGraphics 已经是你的图片了！
    let realPixel = bgGraphics.get(sampleX, sampleY);
    let realColor = color(realPixel[0], realPixel[1], realPixel[2]);

    let d = dist(mouseX, mouseY, cx, cy);
    let mixRatio = map(d, 0, spotlightRadius, 0, 1);
    mixRatio = constrain(mixRatio, 0, 1);
    mixRatio = pow(mixRatio, 1.5); 
    let baseColor = lerpColor(realColor, fogColor, mixRatio);

    let tiltLight = noise(cx * 0.004, cy * 0.004, time * 2); 
    let brightnessMultiplier = map(tiltLight, 0, 1, 0.4, 1.6); 

    let finalR = constrain(red(baseColor) * brightnessMultiplier, 0, 255);
    let finalG = constrain(green(baseColor) * brightnessMultiplier, 0, 255);
    let finalB = constrain(blue(baseColor) * brightnessMultiplier, 0, 255);
    
    fill(finalR, finalG, finalB);

    let strokeAlpha = map(tiltLight, 0, 1, 20, 200);
    stroke(255, strokeAlpha);      
    strokeWeight(0); 
    
    triangle(p1[0], p1[1], p2[0], p2[1], p3[0], p3[1]);
  }

  // 6. 推进时间轴
  time += 0.007; 
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  // 当窗口改变时，setup() 会重新执行，重新把原图按照新比例铺满画布
  points = [];
  setup(); 
}