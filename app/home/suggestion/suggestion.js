import './suggestion.css'
import Image from 'next/image';
const Suggestion = ()=> {
    return (
        <section>
            <div className="title hidden">
                Suggestions
                <hr/>
            </div>

            <div className='card hidden'>
                <div className='details'>
                    <div className='type'>Most Popular</div>
                    <div className='name'>The Great Gatsby</div>
                    <div className='author'>F. Scott Fitzgerald &nbsp;</div>
                    <div className='description'>asdashkfjhaskjh askdh aksj dkasjhd akshd kaj kajhdkas hd</div>
                    <div className='buttons'>
                        <div className='readmore'>Read More</div>
                        <div className='openbook'>Open Book</div>
                    </div>
                </div>     
                <div className='cover_photo'>
                    <div className='photo-container'>
                        {/* <div className='loading'/> */}
                        <Image src="/bookcover.jpg" alt="book cover" width={300} height={450}/>
                    </div>
                </div>     
            </div>
            
            <div className='card reversecard hidden'>
                <div className='details'>
                    <div className='type'>New Release</div>
                    <div className='name'>The Great Gatsby</div>
                    <div className='author'>F. Scott Fitzgerald &nbsp;</div>
                    <div className='description'>asdashkfjhaskjh askdh aksj dkasjhd akshd kaj kajhdkas hd</div>
                    <div className='buttons'>
                        <div className='readmore'>Read More</div>
                        <div className='openbook'>Open Book</div>
                    </div>
                </div>     
                <div className='cover_photo'>
                    <div className='photo-container'>
                        {/* <div className='loading'/> */}
                        <Image src="/bookcover.jpg" alt="book cover" width={300} height={450}/>
                    </div>
                </div>     
            </div>
        </section>
    )
};

export default Suggestion;