/**
 * Created by mengxue on 17/10/25.
 */
$(function () {
    function getUrlParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg);  //匹配目标参数
        if (r != null) return unescape(r[2]);
        return null; //返回参数值
    }

    selectAddress();
    function selectAddress() {
        var nameEl = document.getElementById('sel_city');
        var first = [];
        /* 省，直辖市 */
        var second = [];
        /* 市 */
        var third = [];
        /* 镇 */

        var selectedIndex = [0, 0, 0];
        /* 默认选中的地区 */

        var checked = [0, 0, 0];
        /* 已选选项 */

        function creatList(obj, list) {
            obj.forEach(function (item, index, arr) {
                var temp = new Object();
                temp.text = item.name;
                temp.value = index;
                list.push(temp);
            })
        }

        creatList(city, first);

        if (city[selectedIndex[0]].hasOwnProperty('sub')) {
            creatList(city[selectedIndex[0]].sub, second);
        } else {
            second = [{text: '', value: 0}];
        }

        if (city[selectedIndex[0]].sub[selectedIndex[1]].hasOwnProperty('sub')) {
            creatList(city[selectedIndex[0]].sub[selectedIndex[1]].sub, third);
        } else {
            third = [{text: '', value: 0}];
        }

        var picker = new Picker({
            data: [first, second, third],
            selectedIndex: selectedIndex,
            title: '地址选择'
        });

        picker.on('picker.select', function (selectedVal, selectedIndex) {
            var text1 = first[selectedIndex[0]].text;
            var text2 = second[selectedIndex[1]].text;
            var text3 = third[selectedIndex[2]] ? third[selectedIndex[2]].text : '';

            nameEl.innerText = text1 + ' ' + text2 + ' ' + text3;
        });

        picker.on('picker.change', function (index, selectedIndex) {
            if (index === 0) {
                firstChange();
            } else if (index === 1) {
                secondChange();
            }

            function firstChange() {
                second = [];
                third = [];
                checked[0] = selectedIndex;
                var firstCity = city[selectedIndex];
                if (firstCity.hasOwnProperty('sub')) {
                    creatList(firstCity.sub, second);

                    var secondCity = city[selectedIndex].sub[0]
                    if (secondCity.hasOwnProperty('sub')) {
                        creatList(secondCity.sub, third);
                    } else {
                        third = [{text: '', value: 0}];
                        checked[2] = 0;
                    }
                } else {
                    second = [{text: '', value: 0}];
                    third = [{text: '', value: 0}];
                    checked[1] = 0;
                    checked[2] = 0;
                }

                picker.refillColumn(1, second);
                picker.refillColumn(2, third);
                picker.scrollColumn(1, 0)
                picker.scrollColumn(2, 0)
            }

            function secondChange() {
                third = [];
                checked[1] = selectedIndex;
                var first_index = checked[0];
                if (city[first_index].sub[selectedIndex].hasOwnProperty('sub')) {
                    var secondCity = city[first_index].sub[selectedIndex];
                    creatList(secondCity.sub, third);
                    picker.refillColumn(2, third);
                    picker.scrollColumn(2, 0)
                } else {
                    third = [{text: '', value: 0}];
                    checked[2] = 0;
                    picker.refillColumn(2, third);
                    picker.scrollColumn(2, 0)
                }
            }
        });

        picker.on('picker.valuechange', function (selectedVal, selectedIndex) {

        });

        nameEl.addEventListener('click', function () {
            picker.show();
        });
    }

    //是否默认
    $(document).on('click', '.J_defult', function () {
        if ($(this).hasClass('on')) {
            $(this).removeClass('on').addClass('off')
        } else {
            $(this).removeClass('off').addClass('on')
        }
    });
    //保存
    $(document).on('click', '.J_save', function () {
        var isDefault = 1;
        if ($('.J_defult').hasClass('off')) {
            isDefault = 0
        };
        if ($('input[name="mobile"]').val() == '') {
            //提示
            layer.open({
                content: '请填写联系电话'
                , skin: 'msg'
                , time: 2 //2秒后自动关闭
            });
        } else if ($('input[name="name"]').val() == '') {
            //提示
            layer.open({
                content: '请填写姓名'
                , skin: 'msg'
                , time: 2 //2秒后自动关闭
            });
        } else if ($('.address-area').text() == '') {
            //提示
            layer.open({
                content: '请选择收货地址'
                , skin: 'msg'
                , time: 2 //2秒后自动关闭
            });
        } else if ($('.address-con').val() == '') {
            //提示
            layer.open({
                content: '请填写详细地址'
                , skin: 'msg'
                , time: 2 //2秒后自动关闭
            });
        } else {
            var data = {
                params: {
                    contactMobile: $('input[name="mobile"]').val(),
                    contactName: $('input[name="name"]').val(),
                    address: $('.address-area').text(),
                    fullAddress: $('.address-con').val(),
                    isDefault: isDefault,
                    token: sessionStorage.getItem('token'),
                },
                version: localStorage.getItem('version')
            };
            if (!addressId) {
                data.method = 'create.receiving.address';
                $.ajax({
                    type: 'post',
                    url: 'http://106.15.205.55/order',
                    data: JSON.stringify(data)
                }).done(function (result) {
                    if(result.code == 0){
                        window.location.href = 'addressList.html'
                    }
                });
            } else {
                data.method = 'modify.receiving.address';
                data.params.addressId = addressId;
                $.ajax({
                    type: 'post',
                    url: 'http://106.15.205.55/order',
                    data: JSON.stringify(data)
                }).done(function (result) {
                    if(result.code == 0){
                        window.location.href = 'addressList.html'
                    }
                });
            }
        }
    });

    var addressId = getUrlParam('addressId');
    //编辑地址
    if (addressId) {
        var session = sessionStorage.getItem('addressInfo');
        var str = JSON.parse(session);
        $('input[name="name"]').val(str.name);
        $('input[name="mobile"]').val(str.mobile);
        $('.address-area').text(str.address);
        $('.address-con').val(str.fullAddress);
        if (str.isDefault) {
            $('.J_defult').addClass('on').removeClass('off')
        } else {
            $('.J_defult').addClass('off').removeClass('on')
        }
    }
});
