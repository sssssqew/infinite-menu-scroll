let menu = document.querySelector('.menu')
let items = document.querySelectorAll('.menu-item')
let clones = []
let disableScroll = false
let scrollHeight = 0
let scrollPos = 0
let clonesHeight = 0

// 결론적으로 제대로 동작하지 않아서 헤맨 부분은 메뉴 상단이나 바닥에 도달했을때
// 완전히 끝으로 보내면 제대로 동작하지 않는다. 그래서 메뉴 상단보다 살짝 아래로 보내거나
// 메뉴 완전바닥보다 살짝 위에 있어야 제대로 동작한다. 

function getScrollPos(){
    return menu.scrollTop 
}
// pos 가 1.3 이하이면 scrollTop 값이 0으로 설정됨
// pos 가 1.3보다 커져야 scrollTop 값이 1.3 정도로 설정됨
function setScrollPos(pos){ 
    menu.scrollTop = pos
    // console.log(menu.scrollTop, pos)
}
function getClonesHeight(){ // 브라우저 화면에 보이는 메뉴의 높이
    clonesHeight = 0
    clones.forEach(clone => {
        clonesHeight += clone.offsetHeight 
    })
    return clonesHeight
}
// 화면의 너비(디바이스 크기)가 변하면 스크롤 위치와 메뉴의 컨텐츠 전체높이, 화면에 보이는 메뉴높이가 달라질수 있으므로 다시 계산함
function reCalc(){ // recalculate dimensions when screen is resized
    scrollPos = getScrollPos() // 메뉴의 현재 스크롤 위치 
    scrollHeight = menu.scrollHeight // 메뉴 전체 스크롤 높이 
    clonesHeight = getClonesHeight() // 클론된 요소들의 전체 높이 

    // 맨 처음 화면 로딩시 스크롤을 곧바로 올리면 (스크롤 위치가 0인 상태) scrollUpdate 함수가 실행되지 않음
    // 반드시 한번 스크롤을 내렸다가 다시 올려야 올라감 (그래서 스크롤 초기값을 1로 설정해줘야 스크롤을 초기 로딩시 올릴수 있음)
    if(scrollPos <= 0){ // 스크롤을 올리다가 메뉴의 상단에 닿은 경우 다시 위로 스크롤할 수 있도록 설정함
        setScrollPos(1.5) // 초기 로딩시 스크롤 위치를 1 이상으로 설정하여 초기 로딩시에도 거꾸로 스크롤 가능(메뉴의 맨 마지막부터 볼 수 있도록)하도록 함
    } // 해당 코드를 주석처리하면 거꾸로 스크롤할 수 없게 된다
}
// 맨 처음 화면 로딩시 스크롤을 곧바로 올리면 (스크롤 위치가 0인 상태) scrollUpdate 함수가 실행되지 않음
// 반드시 한번 스크롤을 내렸다가 다시 올려야 올라감 (그래서 스크롤 초기값을 1로 설정해줘야 스크롤을 초기 로딩시 올릴수 있음)
// 그래서 reCalc 함수에서 조건문으로 스크롤 위치를 1 이상으로 설정함
function scrollUpdate(){ // infinite scrolling 
    if(!disableScroll){
        scrollPos = getScrollPos() // 스크롤을 내릴때 scrollUpdate 함수가 실행되므로 무조건 초기 위치는 1보다 크다
        console.log(scrollPos, Math.round(scrollPos), clonesHeight+Math.round(scrollPos), scrollHeight)
        if(clonesHeight + Math.round(scrollPos) >= scrollHeight){ // 스크롤을 아래로 내리다가 메뉴의 바닥에 닿은 경우
            // scroll back to top when we reach bottom 
            setScrollPos(1.5) // 다시 메뉴 상단부터 볼 수 있도록 스크롤 위치 초기화
            disableScroll = true // 초기 위치로 스크롤하는동안 또 스크롤되지 않도록 함
        }
        else if(Math.round(scrollPos) <= 0){ // 스크롤을 위로 올리다가 메뉴의 상단에 닿은 경우
            // scroll to bottom when we reach top
            setScrollPos(scrollHeight - clonesHeight - 3) // 다시 메뉴 하단부터 볼 수 있도록 스크롤 위치를 최대치로 끌어내림 (끝에 완전히 닫지 않도록 해줘야 스크롤을 다시 내릴수 있음)
            disableScroll = true // 초기 위치로 스크롤하는동안 또 스크롤되지 않도록 함
        }
    }
    // 해당코드 없으면 한번만 무한스크롤되고 끝나버림
    if(disableScroll){ // 스크롤하다가 메뉴 상단이나 바닥에 닿은 경우
        // disable scroll-jumping for a short period to avoid flickering 
        // 스크롤 위치가 급격히 이동하는 것이 사용자에게 보이지 않도록 하기 위해 
        window.setTimeout(() => {
            disableScroll = false 
        }, 40) // setScrollPost 에 의해 스크롤 위치가 급격히 이동하는데 40ms 정도 걸린다고 가정함. 스크롤 이동이 끝난직후 다시 스크롤 위치를 설정할 수 있도록 함.
    }
}

function onLoad(){
    items.forEach(item => {
        const clone = item.cloneNode(true)
        clone.classList.add('js-clone')
        menu.appendChild(clone) // 클론을 뒤에 붙여줘야 메뉴가 자연스럽게 연결되는것처럼 보임
    })
    clones = menu.querySelectorAll('.js-clone')
    reCalc() // 설정 초기화
    // console.log(getScrollPos()) // 초기 로딩시 값이 1이상일때 스크롤을 위로 올려서 거꾸로 스크롤 가능함

    menu.addEventListener('scroll', scrollUpdate)
    window.addEventListener('resize', reCalc) // 주석처리해도 동작은 한다
}

window.onload = onLoad




