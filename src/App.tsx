import { url } from 'inspector';
import { useEffect, useState } from 'react';


interface Company {
  International: string,
  Code: string,
  Name: string
}

interface ThemeColor{
  [key:string] :{ //중첩객체에서는 key값이 문자열밖에 못옴 숫자불가능
    back:string,
    hover:string,
    active:string,
    text:string,
    outline:string
  }
}
interface ButtonType {
  name:string;
  theme:string;
}

function App() {

  const [carriers,setCarriers]=useState<Company[]>([]);
  //필터되어서 보여지는 데이터 (국내/국외)
  const [allCarriers,setAllCarriers] = useState<Company[]>([]);
  //국내,국외 택배사 정보를 모두 넣어서 필터시켜서 국내/국외 설정해줌
  const [theme,setTheme]=useState<string>('default');
  //색깔바뀌게 하는거
  //중첩객체를 넣어야함 
  const[tcode,setTcode]=useState<string>('04');
  // 택배사 코드 > 04는 대한통운을 기본으로 설정함
  const[tinvoice,setTinvoice]=useState<string>('');
  // 운송장 번호
  const [tname,setTname]=useState<string>('cj대한통운');
  const [isBtn,setIsBtn] =useState<number|null>(null);
  // const [isBtn,setIsBtn] =useState<number>();
  const [infoTracking,setInfoTracking] = useState<string>();
  // postman에서 send 한 정보를 다가져와야함
  const themeColor :ThemeColor = {
    "default":{
      "back":"bg-indigo-500",
      "hover":"hover:bg-indigo-300",
      "active":"bg-indigo-400",
      "text":"text-indigo-500",
      "outline":"outline-indigo-300"
    },
    "teal":{
      "back":"bg-teal-500",
      "hover":"hover:bg-teal-300",
      "active":"bg-teal-400",
      "text":"text-teal-500",
      "outline":"outline-teal-300"
    },
    "sky":{
      "back":"bg-sky-500",
      "hover":"hover:bg-sky-300",
      "active":"bg-sky-400",
      "text":"text-sky-500",
      "outline":"outline-sky-300"

    },
    "violet":{
      "back":"bg-violet-500",
      "hover":"hover:bg-violet-300",
      "active":"bg-violet-400",
      "text":"text-violet-500",
      "outline":"outline-violet-300"
    }
  }
  //중첩객체 사용법? themeColor['orange'].hover

  const buttons : ButtonType[] =[ 
    {name:"기본",theme:'default'},
    {name:"teal",theme:'teal'},
    {name:"sky",theme:'sky'},
    {name:"violet",theme:'violet'}
  ]
  
  useEffect(()=>{
    const fetchData = async() =>{
      try{
        const res = await fetch(`http://info.sweettracker.co.kr/api/v1/companylist?t_key=${process.env.REACT_APP_API_KEY}`)
        const data = await res.json()
        console.log(data);
        setAllCarriers(data.Company);
        setCarriers(data.Company);
      }catch(error){
        console.log(error)
      }
    }
    fetchData();
  },[])

  const selectCode = (BtnNumber:number,code:string,name:string) =>{
    setIsBtn(BtnNumber);
    setTcode(code);
    setTname(name);
    const isInternational = BtnNumber === 2 ? 'true' : "false" 
    // 국외는 문자열로 true / false 값을 받기 때문에 설정해줌
    const filterCarriers = allCarriers.filter(e=>e.International === isInternational);
    // 필터해서 내가 선택한 국외택배사가 국외라면
    setCarriers(filterCarriers);
    //필터된 캐리어에 집어넣음
  }
  const blindNumber = (e:React.ChangeEvent<HTMLInputElement>) =>{ 
    //oninput 이벤트는 string을 받을 때 위의 코드처럼 받아야함
      const value = e.target.value;

      e.target.value = e.target.value.replace(/[^0-9]/g,'')
      setTinvoice(value)
  }
  const PostSubmit = async() =>{
    // console.log(tcode,tinvoice,tname)
    // const url = new URL(`http://info.sweettracker.co.kr/api/v1/trackingInfo?t_code=${tcode}&t_invoice=${tinvoice}&t_key=${process.env.REACT_APP_API_KEY}`)
    // const url = new URL('http://info.sweettracker.co.kr/api/v1/trackingInfo');
    // url.searchParams.append("t_code",tcode);
    // url.searchParams.append("t_invoice",tinvoice);
    // url.searchParams.append("t_key",`${process.env.REACT_APP_API_KEY}`);
    // console.log(url);

    try{
      const res = await fetch (`http://info.sweettracker.co.kr/api/v1/trackingInfo?t_code=${tcode}&t_invoice=${tinvoice}&t_key=${process.env.REACT_APP_API_KEY}`);
      const data = res.json();
      console.log(data); //pending 세번째 클릭하면 데이터가 나옴
    }catch(error){
      console.log(error)
    }
  }
  
  return (
    <>
      {/* <p>{themeColor[theme] && themeColor["sky"].back}</p> //&&는 앞에 데이터가 있을떄 뒤에가 실행되도록 하는것(에러방지용임 >> 습관으로 계속 적어주는게 좋음)
      <p className="text-center text-purple-500 text-lg font-bold italic">Lorem ipsum dolor sit amet.</p> */}
      <div className={`${themeColor[theme].back} p-5 text-black text-sm md:text-xl xl:text-2xl flex justify-between`}>
        <h3 className="font-extrabold">국내.외 택배조회 시스템</h3>
        <div className="">
          <span className="">테마 :</span>
          {
            buttons.map((e,i)=>{
              return(
                <button key={i} className={`mx-1 md:mx-2 xl:mx-3 ${themeColor[theme].active}`} onClick={()=>{setTheme(e.theme)}}>{e.name}</button>
                //재렌더링 되는 state 값을 변경해줘야함
              )
            })
          }
        </div>
      </div> 
      <div className="w-4/5 md:w-3/5 xl:1/3 mx-auto my-40 flex roudned items-center pt-2 flex-wrap "> 
        <div className="basis-full py-2 px-2 flex justify-center items-center text-md">
          택배 검색
        </div>
        
        <div className="border-b basis-full py-2 px-2 flex justify-center items-center text-sm">
          <span className=" text-center mr-5">국내 / 국외 선택</span>
          <button onClick={()=>selectCode(1, '04' ,'CJ대한통운')} className={`text-sm border p-1 px-5 rounded hover:text-white mr-4 ${isBtn === 1 ? "text-white" :"text-black"} ${themeColor[theme].hover} ${isBtn === 1 && themeColor[theme].active} `}>국내</button>
          <button onClick={()=>selectCode(2, '12' ,'EMS')} className={`text-sm border p-1 px-5 rounded hover:text-white  ${isBtn === 2 ? "text-white" :"text-black"} ${themeColor[theme].hover} ${isBtn === 2 && themeColor[theme].active}`}>국외</button>
        </div>
        {/* {tcode}{tname} */}
        <div className="basis-full py-4 border-b">
          <select className='w-full border p-2 rounded-md appearance-none outline-none' value={tcode} onChange={(e)=>setTcode(e.target.value)}>
            {/* appearance-none */}
            {
              carriers.map((e,i)=>{
                return(
                    <option key={i} value={e.Code}>{e.Name}</option>
                )
              })
            }
          </select>
        </div>
        {tinvoice}
        <div className="basis-full py-4 border-b text-center">
            <input type="text" onInput={blindNumber} placeholder='운송장 번호를 입력해주세요' className={`w-full border px-5 py-2 rounded-md outline-indigo-300 ${themeColor[theme].outline}`}/>
        </div>
        <div className="basis-full border-b py-4 text-center">
          <button onClick={PostSubmit} className={`${themeColor[theme].back} text-white px-4 py-2 rounded-md w-full`}>조회하기</button>
        </div>
    </div>
    </>
  );
}

export default App;
