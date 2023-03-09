export const optionWave = {
  backgroundStyle: {
    borderColor: '#fbe6e1', // 背景内边框
    color: '#fbe6e1' // 背景颜色
  },
  series: [
    {
      type: 'liquidFill', // 水位图
      radius: '60%', // 显示比例
      center: ['14%', '50%'], // 中心点
      // amplitude: 20, // 水波振幅
      data: [0.5], // data个数代表波浪数
      color: [
        {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 1,
              color: '#d36548'
            },
            {
              offset: 0.5,
              color: '#d36548'
            },
            {
              offset: 0,
              color: '#d36548'
            }
          ],
          globalCoord: false
        }
      ], // 波浪颜色
      itemStyle: {
        opacity: 0.95,
        shadowColor: 'rgba(0, 0, 0, 0)'
      },
      backgroundStyle: {
        borderWidth: 1, // 外边框
        // borderColor: '#23cc72', //边框颜色
        color: '#fbe6e1' // 边框内部填充部分颜色
      },
      label: {
        // 标签设置
        position: ['50%', '45%'],
        formatter: '50%', // 显示文本,
        fontSize: '18px', // 文本字号,
        fontWeight: 400,
        color: '#000'
      },
      outline: {
        borderDistance: 4,
        itemStyle: {
          borderWidth: 1,
          borderColor: '#d36548'
        }
      }
    },
    {
      type: 'liquidFill', // 水位图
      radius: '60%', // 显示比例
      center: ['38%', '50%'], // 中心点
      // amplitude: 20, // 水波振幅
      data: [0.5], // data个数代表波浪数
      color: [
        {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 1,
              color: '#f6c66f'
            },
            {
              offset: 0.5,
              color: '#f6c66f'
            },
            {
              offset: 0,
              color: '#f6c66f'
            }
          ],
          globalCoord: false
        }
      ], // 波浪颜色
      itemStyle: {
        opacity: 0.95,
        shadowColor: 'rgba(0, 0, 0, 0)'
      },
      backgroundStyle: {
        borderWidth: 1, // 外边框
        // borderColor: '#23cc72', //边框颜色
        color: '#fdf1dc' // 边框内部填充部分颜色
      },
      label: {
        // 标签设置
        position: ['50%', '45%'],
        formatter: '50%', // 显示文本,
        fontSize: '18px', // 文本字号,
        fontWeight: 400,
        color: '#000'
      },
      outline: {
        borderDistance: 4,
        itemStyle: {
          borderWidth: 1,
          borderColor: '#f6c66f'
        }
      }
    },
    {
      type: 'liquidFill', // 水位图
      radius: '60%', // 显示比例
      center: ['62%', '50%'], // 中心点
      // amplitude: 20, // 水波振幅
      data: [0.5], // data个数代表波浪数
      color: [
        {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 1,
              color: '#f4b76c'
            },
            {
              offset: 0.5,
              color: '#f4b76c'
            },
            {
              offset: 0,
              color: '#f4b76c'
            }
          ],
          globalCoord: false
        }
      ], // 波浪颜色
      itemStyle: {
        opacity: 0.95,
        shadowColor: 'rgba(0, 0, 0, 0)'
      },
      backgroundStyle: {
        borderWidth: 1, // 外边框
        // borderColor: '#23cc72', //边框颜色
        color: '#fbebd9' // 边框内部填充部分颜色
      },
      label: {
        // 标签设置
        position: ['50%', '45%'],
        formatter: '50%', // 显示文本,
        fontSize: '18px', // 文本字号,
        fontWeight: 400,
        color: '#000'
      },
      outline: {
        borderDistance: 4,
        itemStyle: {
          borderWidth: 1,
          borderColor: '#f4b76c'
        }
      }
    },
    {
      type: 'liquidFill', // 水位图
      radius: '60%', // 显示比例
      center: ['86%', '50%'], // 中心点
      // amplitude: 20, // 水波振幅
      data: [0.5], // data个数代表波浪数
      color: [
        {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 1,
              color: '#eadf8f'
            },
            {
              offset: 0.5,
              color: '#eadf8f'
            },
            {
              offset: 0,
              color: '#eadf8f'
            }
          ],
          globalCoord: false
        }
      ], // 波浪颜色
      itemStyle: {
        opacity: 0.95,
        shadowColor: 'rgba(0, 0, 0, 0)'
      },
      backgroundStyle: {
        borderWidth: 1, // 外边框
        // borderColor: '#23cc72', //边框颜色
        color: '#fafae1' // 边框内部填充部分颜色
      },
      label: {
        // 标签设置
        position: ['50%', '45%'],
        formatter: '50%', // 显示文本,
        fontSize: '18px', // 文本字号,
        fontWeight: 400,
        color: '#000'
      },
      outline: {
        borderDistance: 4,
        itemStyle: {
          borderWidth: 1,
          borderColor: '#eadf8f'
        }
      }
    }
  ]
}
