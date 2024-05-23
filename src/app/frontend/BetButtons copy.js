export default function SuiteButtons({controller}) {
  if(controller)
    return (
      <div class="absolute flex bg-black h-24 space-x-8">
        <div class='h-24 w-24 rounded-full flex items-center place-content-center bg-white' onClick={()=>controller.chooseSuite('Hearts')}>Hearts</div>
        <div class='h-24 w-24 rounded-full flex items-center place-content-center bg-white' onClick={()=>controller.chooseSuite('Diamonds')}>Diamonds</div>
        <div class='h-24 w-24 rounded-full flex items-center place-content-center bg-white' onClick={()=>controller.chooseSuite('Spades')}>Spades</div>
        <div class='h-24 w-24 rounded-full flex items-center place-content-center bg-white' onClick={()=>controller.chooseSuite('Clubs')}>Clubs</div>
        
      </div>
    );
}