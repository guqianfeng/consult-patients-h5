<script setup lang="ts">
import { getMedicalOrderLogistics } from '@/services/order'
import type { Logistics } from '@/types/order'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import AMapLoader from '@amap/amap-jsapi-loader'
import { shallowRef } from 'vue'
import endImg from '@/assets/end.png'
import startImg from '@/assets/start.png'
import carImg from '@/assets/car.png'

// key  安全密钥
// 60f5c92bc188e6227cfc5ee74a22d41a	9864bad37366fa776a6687f2486cf2cf
window._AMapSecurityConfig = {
  securityJsCode: '9864bad37366fa776a6687f2486cf2cf'
}

const map = shallowRef()

const initMap = () => {
  AMapLoader.load({
    key: '60f5c92bc188e6227cfc5ee74a22d41a', // 申请好的Web端开发者Key，首次调用 load 时必填
    version: '2.0', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    plugins: [''] // 需要使用的的插件列表，如比例尺'AMap.Scale'等
  })
    .then((AMap) => {
      // 初始化地图开始
      map.value = new AMap.Map('map', {
        //设置地图容器id
        // viewMode: '3D', //是否为3D地图模式
        zoom: 12, //初始化地图级别
        // center: [105.602725, 37.076636] //初始化地图中心点位置
        mapStyle: 'amap://styles/whitesmoke'
      })
      // 路线规划
      AMap.plugin('AMap.Driving', function () {
        var driving = new AMap.Driving({
          map: map.value,
          // 驾车路线规划策略，AMap.DrivingPolicy.LEAST_TIME是最快捷模式
          policy: AMap.DrivingPolicy.LEAST_TIME,
          showTraffic: false,
          hideMarkers: true
        })

        const start = logistics.value?.logisticsInfo.shift()
        const end = logistics.value?.logisticsInfo.pop()
        // 开始的经纬度
        var startLngLat = [start?.longitude, start?.latitude]
        // 结束的经纬度
        var endLngLat = [end?.longitude, end?.latitude]

        var startMarker = new AMap.Marker({
          position: startLngLat,
          icon: startImg,
          anchor: 'bottom-center'
        })
        map.value?.add(startMarker)

        var endMarker = new AMap.Marker({
          position: endLngLat,
          icon: endImg,
          anchor: 'bottom-center'
        })
        map.value?.add(endMarker)

        driving.search(
          startLngLat,
          endLngLat,
          {
            waypoints: logistics.value?.logisticsInfo.map((item) => {
              return [item.longitude, item.latitude]
            })
          },
          function (status: 'complete' | 'error' | 'no_data', result: object) {
            // 未出错时，result即是对应的路线规划方案
            // console.log(status, result)
            if (status === 'complete') {
              var carMarker = new AMap.Marker({
                position: [
                  logistics.value?.currentLocationInfo.longitude,
                  logistics.value?.currentLocationInfo.latitude
                ],
                icon: carImg,
                anchor: 'center'
              })
              map.value?.add(carMarker)
              setTimeout(() => {
                map.value.setFitView([carMarker])
                map.value.setZoom(20)
              }, 3000)
            }
          }
        )
      })
    })
    .catch((e) => {
      console.log(e)
    })
}

// 获取物流信息
const logistics = ref<Logistics>()
const route = useRoute()
onMounted(async () => {
  const res = await getMedicalOrderLogistics(route.params.id as string)
  logistics.value = res.data
  initMap()
})
</script>

<template>
  <div class="order-logistics-page">
    <div id="map">
      <div class="title">
        <van-icon name="arrow-left" @click="$router.back()" />
        <span>{{ logistics?.statusValue }}</span>
        <van-icon name="service" />
      </div>
      <div class="current">
        <p class="status">
          {{ logistics?.statusValue }} 预计{{ logistics?.estimatedTime }}送达
        </p>
        <p class="predict">
          <span>{{ logistics?.name }}</span>
          <span>{{ logistics?.awbNo }}</span>
        </p>
      </div>
    </div>
    <div class="logistics">
      <p class="title">物流详情</p>
      <van-steps direction="vertical" :active="0">
        <van-step v-for="item in logistics?.list" :key="item.id">
          <p class="status" v-if="item.statusValue">{{ item.statusValue }}</p>
          <p class="content">{{ item.content }}</p>
          <p class="time">{{ item.createTime }}</p>
        </van-step>
      </van-steps>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.order-logistics-page {
  --van-step-icon-size: 18px;
  --van-step-circle-size: 10px;
}
#map {
  height: 450px;
  background-color: var(--cp-bg);
  overflow: hidden;
  position: relative;
  .title {
    background-color: #fff;
    height: 46px;
    width: 355px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    padding: 0 15px;
    font-size: 16px;
    position: absolute;
    left: 10px;
    top: 10px;
    box-sizing: border-box;
    box-shadow: 0px 0px 22px 0px rgba(229, 229, 229, 0.5);
    z-index: 999;
    > span {
      flex: 1;
      text-align: center;
    }
    .van-icon {
      font-size: 18px;
      color: #666;
      &:last-child {
        color: var(--cp-primary);
      }
    }
  }
  .current {
    height: 80px;
    border-radius: 4px;
    background-color: #fff;
    height: 80px;
    width: 355px;
    box-sizing: border-box;
    padding: 15px;
    position: absolute;
    left: 10px;
    bottom: 10px;
    box-shadow: 0px 0px 22px 0px rgba(229, 229, 229, 0.5);
    z-index: 999;
    .status {
      font-size: 15px;
      line-height: 26px;
    }
    .predict {
      color: var(--cp-tip);
      font-size: 13px;
      margin-top: 5px;
      > span {
        padding-right: 10px;
      }
    }
  }
}
.logistics {
  padding: 0 10px 20px;
  .title {
    font-size: 16px;
    padding: 15px 5px 5px;
  }
  .van-steps {
    :deep(.van-step) {
      &::after {
        display: none;
      }
    }
    .status {
      font-size: 15px;
      color: var(--cp-text3);
      margin-bottom: 4px;
    }
    .content {
      font-size: 13px;
      color: var(--cp-tip);
      margin-bottom: 4px;
    }
    .time {
      font-size: 13px;
      color: var(--cp-tag);
    }
  }
}
</style>
