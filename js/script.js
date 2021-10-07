var tabs={
    tab: ".card__list-item",
    mobileTab:".card__mobile-list-item",
    tabStyle: function(){
        $(document).on("click",tabs.tab,function(){
            $(".card__list-item").find(".list-item__text").removeClass("active-tab");
            $(".card__list-item").find(".active-tab-border").remove();
            $(this).find(".list-item__text").addClass("active-tab");
            $(this).prepend('<span class="active-tab-border"></span>');
        });
        $(document).on("click",tabs.mobileTab,function(){
            $(".card__mobile-list-item").removeClass("active-tab-mobile");
            $(this).addClass("active-tab-mobile");
        });
    },
    tabChange: function(){
        $(document).on("click",tabs.tab,function(){
            $(".tab-pane").removeClass("active");
            var getId=$(this).attr("link-id");
            $(".tab-pane[aria-labelledby='"+getId+"']").addClass("active");
        });
        $(document).on("click",tabs.mobileTab,function(){
            $(".tab-pane").removeClass("active");
            var getId=$(this).attr("link-id");
            $(".tab-pane[aria-labelledby='"+getId+"']").addClass("active");
        });
    },
    init: function(){
        tabs.tabStyle();
        tabs.tabChange();
    }
}
var data={
    getData:function(){
        $.ajax({
            method: "GET",
            url: "../product-list.json",
            dataType: 'json',
            contentType:'application/json',
            headers: {
                'Access-Control-Allow-Origin': '*',
              },
        })
        .done(function(json) {
            var categories= json.responses[0][0].params.recommendedProducts;
            if(categories){
                data.getUserCategories(Object.keys(categories));
                data.getProducts(categories);
                data.convertSlider();
            }
        });
    },
    getUserCategories: function(categories){
        $.each( categories, function(i, val){
            if(!val.includes("RECOMMENDATION")){
                if(val.includes(">")){
                    val=val.split(">");
                    val=val[1];
                }
                if(i==0){
                    $("#desktopUserCategories").append('<li class="card__list-item py-2 pl-3" link-id="link'+i+'"><span class="active-tab-border"></span><span class="pl-2 list-item__text active-tab">'+val+'</span></li>');
                    $("#mobileUserCategories").append('<a class="nav-link card__mobile-list-item active-tab-mobile" link-id="link'+i+'" href="javascript:;">'+val+'</a>');
                }
                else{
                    $("#desktopUserCategories").append('<li class="card__list-item py-2 pl-3" link-id="link'+i+'"><span class="pl-2 list-item__text">'+val+'</span></li>');
                    $("#mobileUserCategories").append('<a class="nav-link card__mobile-list-item" link-id="link'+i+'" href="javascript:;">'+val+'</a>');
                }
            }
        });
    },
    getProducts:function(products){
        var counter=0;
        $.each( products, function(val){
            if(!val.includes("RECOMMENDATION")){
                if(counter==0){
                    $("#tabContent").append('<div class="tab-pane active" id="tab'+counter+'" role="tabpanel" aria-labelledby="link'+counter+'"><div class="responsive"></div></div>');
                }
                else{
                    $("#tabContent").append('<div class="tab-pane" id="tab'+counter+'" role="tabpanel" aria-labelledby="link'+counter+'"><div class="responsive"></div></div>');
                }
                var arr=Object.values(products)[counter];
                $.each( arr, function(i, val){
                    $("#tab"+counter).find(".responsive").append('<div class="product-box"><div class="product-box__image"><img data-lazy="'+val.image+'" src="https://via.placeholder.com/200" alt="segmentify"></div><div class="product-box__description"><div class="product-box__title">'+val.name+'</div><div class="product-box__price">'+val.priceText+'</div><div class="product-box__cargo '+val.params.shippingFee.toLowerCase()+'" id="cargo'+i+'"><i class="fas fa-truck product-box__icon-green d-none d-md-inline-block"></i><span class="d-md-none">+</span> Ücretsiz Kargo</div><div class="product-box__add-cart"><button class="btn btn-primary btn-block p-2 mb-2 add-to-cart-btn">Sepete Ekle</button></div></div></div>');
                });
                
                counter++;
             }
        });
    },
    convertSlider:function(){
        $('.responsive').slick({
            lazyLoad: 'ondemand',
            dots: false,
            infinite: false,
            speed: 300,
            slidesToShow: 4.2,
            slidesToScroll: 1,
            responsive: [
                {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3.1,
                    slidesToScroll: 1,
                }
                },
                {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2.1,
                    slidesToScroll: 1
                }
                },
                {
                breakpoint: 480,
                settings: {
                    slidesToShow: 2.1,
                    slidesToScroll: 1
                }
                }
            ]
        });
    },
    showPopup:function(){
        $(document).on("click",".add-to-cart-btn",function(){
            $(".popup").removeClass("d-none");
        });
    },
    closePopup:function(){
        $(document).on("click",".popup__close",function(){
            $(".popup").addClass("d-none");
        });
    },
    init:function(){
        data.getData();
        data.showPopup();
        data.closePopup();
    }
}
$(document).ready(function(){
    var ww=window.innerWidth;
    if(ww<920){
        $(".card-mobile-nav").removeClass("nav");
    }
    tabs.init();
    data.init();
});