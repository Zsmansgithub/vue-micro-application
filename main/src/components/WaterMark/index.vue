<template>
<div class="watermark-wrapper" ref="watermarkWrapper">
    <canvas ref="canvas" :width="cwidth" :height="cheight" :style="{width: `${cwidth}px`,height: `${cheight}px`}"></canvas>
</div>
</template>

<script>
const tools = {
    ItemWidth: 50,
    ItemHeight: 40,
    color: 'rgba(235, 235, 235, 1)',
    fontSize: 24
};
const { ItemWidth, ItemHeight, fontSize, color } = tools;
export default {
    data () {
        return {
            cwidth: null,
            cheight: null,
        };
    },
    mounted () {
        this.$nextTick(() => {
            this.getSize();
            this.$nextTick(() => {
                    this.init(this.cwidth, this.cheight);
                });
        });
    },
    methods: {
        getSize() {
            const wappersize = this.$refs.watermarkWrapper.getBoundingClientRect();
            this.cwidth = wappersize.width * 2;
            this.cheight = wappersize.height * 2;
        },
        init ({ cwidth = 1600, cheight = 800 } = arguments) {
            const watermarkText = `${this.$store.getters.name} ${this.$store.getters.uuid}`;
            const canImg = document.createElement('canvas');
            const canImg2d = canImg.getContext('2d');
            canImg2d.font = `${fontSize}px serif`;
            canImg2d.fillStyle = color;
            canImg2d.textBaseLine = 'middle';
            const widthText = canImg2d.measureText(watermarkText).width;
            const heightText = widthText * 0.62;
            canImg.width = widthText;
            canImg.height = heightText;
            canImg2d.translate(fontSize / 2, 0);
            canImg2d.rotate((Math.PI / 180) * 30);
            canImg2d.font = `${fontSize}px serif`;
            canImg2d.fillStyle = color;
            canImg2d.textBaseLine = 'middle';
            canImg2d.fillText(watermarkText, 0, fontSize);

            const crxd = this.$refs.canvas;
            const crx2d = crxd.getContext('2d');

            let [x, y] = [0, 0];
            while (x < cwidth) {
                while (y < cheight) {
                    crx2d.drawImage(canImg, x, y, widthText, heightText);
                    y += heightText + ItemHeight;
                }
                x += widthText + ItemWidth;
                y = 0;
            }
        }
    }
};
</script>

<style lang="scss" scoped>
.watermark-wrapper {
    overflow: hidden;
    position: absolute;
    left: 0;
    top: 0;
    z-index: -10;
    width: 100%;
    height: 100%;
    pointer-events: none;
}
</style>
