export default function BetButtons({controller}) {
  if(controller)
    return (
      <div class="absolute flex bg-black h-24 space-x-8">
        <div class='h-24 w-24 rounded-full flex items-center place-content-center bg-white' onClick={()=>controller.placeBet(0)}>Pass</div>
        <div class='h-24 w-24 rounded-full flex items-center place-content-center bg-green-600' onClick={()=>controller.placeBet(15)}>15</div>
        <div class='h-24 w-24 rounded-full flex items-center place-content-center bg-red-600' onClick={()=>controller.placeBet(20)}>20</div>
        <div class='h-24 w-24 rounded-full flex items-center place-content-center bg-blue-600' onClick={()=>controller.placeBet(25)}>25</div>
        <div class='h-24 w-24 rounded-full flex items-center place-content-center bg-purple-600' onClick={()=>controller.placeBet(30)}>30</div>
      </div>
    );
}