<template>
  <div class="schedule_card">
    <div class="schedule_list_box" v-for="(item,index) in scheduleList" :key="index">
      <div class="schedule_list_top" v-if="!peopleName">
        <span class="date">{{item.date}}</span>
        <span class="week">{{weekText[item.week-1]}}</span>
      </div>
      <div class="schedule_list_top people_schedule_list_top" v-if="peopleName">
        <span class="date">{{item.name}}</span>
      </div>
      <div class="schedule_list_bottom">
        <div
          class="schedule_content_wrap"
          v-for="(jitem,jindex) in item.list"
          :key="'jindex'+jindex"
        >
        <router-link :to="{ path: '/schedule/scheduleDetail/', query: { scheduleID: jitem.scheduleID,userId:userId}}" >

          <div class="schedule_content">
            <div class="schedule_top">
              <span class="tag">{{jitem.label}}{{jitem.creatorId==jitem.userId?"":"(代)"}}</span>
              <span class="time" >{{jitem.date}}  {{jitem.startTime}}-{{jitem.endTime}}</span>
              <!-- <span class="time" v-if="showDate">{{jitem.date}}  {{jitem.startTime}}-{{jitem.endTime}}</span> -->
              <!-- <span class="time" v-if="!showDate">{{jitem.startTime}}-{{jitem.endTime}}</span> -->
            </div>
            <div class="schedule_bottom ellipsis">{{jitem.content}}</div>
          </div>
        </router-link>
          <div class="address_wrap">
            <img class="address_icon" src="/static/img/map_green.png">
            <span class="address ellipsis">{{jitem.place}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  // props: ["peopleName", "datalist","showDate"],
    props: ["peopleName", "datalist"],

  data() {
    return {
      userId:'',
      weekText:["周一","周二","周三","周四","周五","周六","周日"]
		};
  },
  created() {
    console.log("oooooo", this.datalist);
		this.userId=this.$route.query.userId;

  },
  computed: {
    scheduleList: {
      get: function() {
        return this.formatData();
      },
      set: function() {}
    }
  },
  methods: {
    formatData() {
      let arr = [];
      if (this.datalist.length > 0) {
        listsLabel: for (let i = 0; i < this.datalist.length; i++) {
          let row = this.datalist[i];
          if (i == 0) {
            if (row.week) {
              //若按时间查
              arr.push({
                week: row.week,
                date: row.day,
                list: [row]
              });
            } else {
              //若按人名查
              arr.push({
                name: row.name,
                userId: row.userId,
                list: [row]
              });
            }
            continue;
          }

          for (let j = 0; j < arr.length; j++) {
            if (row.week) {
              //若按时间查
              if (row.week == arr[j].week) {
                arr[j].list.push(row);
                continue listsLabel;
              } else {
                if (j == arr.length - 1) {
                  arr.push({
                    week: row.week,
                    date: row.day,
                    list: [row]
                  });
                  continue listsLabel;
                }
              }
            } else {
              if (row.userId == arr[j].userId) {
                arr[j].list.push(row);
                continue listsLabel;
              } else {
                if (j == arr.length - 1) {
                  arr.push({
                    name: row.name,
                    userId: row.userId,
                    list: [row]
                  });
                  continue listsLabel;
                }
              }
            }
          }
        }
      }
      return arr;
    }
  }
};
</script>

<style lang="" scoped>
.schedule_list_top {
  text-align: left;
  color: #c0ccda;
  padding-left: 12px;
}
.people_schedule_list_top {
  margin-top: 12px;
}
.schedule_list_top .date {
  font-size: 23px;
  font-weight: bold;
}
.schedule_list_top .week {
  font-size: 14px;
}
.schedule_list_bottom {
  width: 100%;
  position: relative;
}
.schedule_content_wrap {
  width: calc(100% - 50px-15px);
  margin-left: 50px;
  padding: 5px 5px 0;
}
/* 行程列表选中的颜色 */
.has_choose .schedule_list_top {
  color: #608bf7;
}
.has_choose .schedule_list_bottom:before {
  background: #608bf7;
}
.has_choose .schedule_list_bottom:after {
  background: url("/static/img/cicle_blue.png") no-repeat 0 0;
  background-size: 100% 100%;
  background-color: #fff;
}
/* 行程列表小卡片选中 */
.has_choose_card {
  box-shadow: 0 2px 4px #608bf7;
}
.schedule_content_wrap .has_choose_card .schedule_top .tag {
  color: #608bf7;
}
.schedule_content_wrap .has_choose_card .schedule_top .time {
  color: #608bf7;
}
.schedule_content_wrap .has_choose_card .schedule_bottom {
  color: #608bf7;
}

.schedule_list_bottom:before {
  content: "";
  width: 1px;
  height: 100%;
  position: absolute;
  top: 0;
  left: 33px;
  background: #c0ccda;
}
.schedule_list_bottom:after {
  content: "";
  width: 12px;
  height: 12px;
  position: absolute;
  top: 0;
  left: 27px;
  background: url("/static/img/cicle_gray.png") no-repeat 0 0;
  background-size: 100% 100%;
  background-color: #fff;
  border-radius: 50%;
  overflow: hidden;
}
.schedule_content_wrap .schedule_content {
  height: 49px;
  background: #fff;
  border-radius: 5px;
}
.schedule_content_wrap .schedule_top {
  display: flex;
  justify-content: space-between;
}
.schedule_content_wrap .schedule_top .tag {
  color: #000;
  font-size: 14px;
  display: block;
  height: 20px;
  line-height: 20px;
  margin: 5px 0 0 5px;
}
.schedule_content_wrap .schedule_top .time {
  color: #666;
  font-size: 12px;
  display: block;
  height: 17px;
  line-height: 17px;
  margin: 6px 6px 0 0;
}
.schedule_bottom {
  margin: 2.5px 0 0 5px;
  text-align: left;
  color: #333;
  font-size: 12px;
}
.address_wrap {
  margin-top: 6px;
  text-align: left;
  margin-bottom: 12px;
}
.address_wrap img {
  width: 13px;
  height: 15px;
  vertical-align: middle;
}
.address_wrap .address {
  font-size: 12px;
  color: #666;
  display: inline-block;
  vertical-align: middle;
  margin-top: -2px;
  width:calc(100% - 30px)
}
</style>
