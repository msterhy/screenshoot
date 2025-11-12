class MarkSprite {
  private static drawWaterQualityCard(ctx: CanvasRenderingContext2D, data: any) {
    const cardWidth = 192;
    const cardHeight = 132;
    const padding = 10; // 卡片内边距

    // --- 绘制卡片背景和边框 ---

    // 1. 创建边框的线性渐变
    const borderGradient = ctx.createLinearGradient(0, 0, 0, cardHeight);
    borderGradient.addColorStop(0, 'rgba(237, 187, 163, 0.297751)'); // #EDBBA3
    borderGradient.addColorStop(0.999681, 'rgba(234, 144, 105, 0.651285)'); // #EA9069

    // 2. 绘制卡片填充背景
    ctx.globalAlpha = 0.75; // 背景透明度
    ctx.fillStyle = '#13171E'; // 背景颜色
    ctx.fillRect(0, 0, cardWidth, cardHeight);

    // 3. 绘制卡片渐变描边
    ctx.globalAlpha = 1; // 恢复不透明度，只让描边应用渐变
    ctx.strokeStyle = borderGradient;
    ctx.lineWidth = 1;
    // 描边矩形，注意 Canvas 的 strokeRect 是居中描边的，为了保持 SVG 的 0.5px 偏移效果，
    // 我们可以在绘制时也使用 0.5px 的偏移。
    ctx.strokeRect(0.5, 0.5, cardWidth - 1, cardHeight - 1);

    // --- 绘制顶部橙色条和右下角橙色块 ---
    ctx.fillStyle = '#EA9069'; // 橙色
    ctx.fillRect(0, 0, cardWidth, 2); // 顶部橙色条
    ctx.fillRect(cardWidth - 6, cardHeight - 2, 6, 2); // 右下角橙色块

    // --- 绘制标题区域 ---
    const headerY = padding;
    const headerIconX = padding;
    const headerTextX = headerIconX + 16 + 8; // 图标宽度 + 间距
    const headerLineY = headerY + 25; // 分隔线的 Y 坐标

    // 绘制水滴图标
    ctx.fillStyle = '#EA9069';
    // 简单模拟水滴，画一个圆角矩形然后旋转，或者画一个路径
    ctx.beginPath();
    ctx.arc(headerIconX + 8, headerY + 12, 6, 0, Math.PI * 2); // 假设是个圆，或者用路径更精准
    ctx.fill();
    // 这是一个更接近你图片中水滴形状的简单路径绘制
    ctx.translate(headerIconX + 8, headerY + 10); // 移动原点到水滴中心
    ctx.rotate(-45 * Math.PI / 180); // 旋转
    // 绘制标题文本
    ctx.font = 'bold 14px Arial'; // 字体样式
    ctx.fillStyle = '#EA9069'; // 标题颜色
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle'; // 基线对齐
    ctx.fillText(data.title, headerTextX, headerY + 12); // 12是大概的字体中心Y偏移
    // 绘制头部下方的分隔线
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding, headerLineY);
    ctx.lineTo(cardWidth - padding, headerLineY);
    ctx.stroke();
    // --- 绘制数据列表 ---
    const itemStartY = headerLineY + 8 + 10; // 分隔线下方间距 + 第一行文本大致中心位置
    const lineHeight = 20; // 每行高度
    ctx.font = '13px Arial'; // 数据项字体
    ctx.textBaseline = 'middle'; // 基线对齐
    data.items.forEach((item, index) => {
      const currentY = itemStartY + index * lineHeight;
      // 绘制标签
      ctx.fillStyle = '#B8CCE2'; // 标签颜色稍浅
      ctx.textAlign = 'left';
      ctx.fillText(item.label, padding, currentY);
      // 绘制值
      if (item.critical) {
        // 警告值，需要特殊处理感叹号
        ctx.fillStyle = '#FF5C5C'; // 警告颜色
        ctx.textAlign = 'right';
        const valueText = item.value;
        // 测量感叹号宽度和剩余文本宽度
        const exclamationMark = '!';
        // const exclamationWidth = ctx.measureText(exclamationMark).width;
        // 绘制感叹号
        ctx.fillText(exclamationMark, cardWidth - padding - ctx.measureText(valueText).width - 2, currentY); // 感叹号在值前，预留空间
        // 绘制剩余的值文本
        ctx.fillStyle = '#B8CCE2'; // 恢复白色
        ctx.fillText(valueText, cardWidth - padding, currentY);
      } else {
        // 普通值
        ctx.fillStyle = '#B8CCE2'; // 普通值颜色
        ctx.textAlign = 'right';
        ctx.fillText(item.value, cardWidth - padding, currentY);
      }
    });
    // 绘制完成后，最好将 globalAlpha 恢复为默认的 1
    ctx.globalAlpha = 1;
  }
}
