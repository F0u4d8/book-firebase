import Image from 'next/image'
import { lusitana } from '../fonts'

export default function StoreLogo( {image , name} : {image : string | undefined , name : string | undefined}) {
  console.log(image);
  
  return (

      <div
        className={`${lusitana.className} flex items-center space-x-2`}
      >
        <Image
          src={image || "/no-image.png"}
          width={100}
          height={100}
          alt={name ||"not found image"}
          priority
        />
        <span className="text-xl">{`${name} store`}</span>
      </div>
  )
}