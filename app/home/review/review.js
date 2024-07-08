import './review.css';
import Image from 'next/image';

const Review = () => {
  return (
    <section>
        <div className='title hidden'>
            Reviews
            <hr/>
        </div>

        <div className='review_container'>
            <div className='review_content hidden'>
                <div className='quote'>
                    "This platform has transformed my reading experience. I love discovering new authors and sharing my thoughts through reviews. The community is incredibly supportive and engaging!"
                </div>
                <div className='writer'>

                    <div className='pfp'>
                        <Image src="/reader-pfp.png" alt="book cover" width={300} height={450}/>
                    </div>
                    <div className='name'>
                        Jane Doe, Reader
                    </div>
                </div>
            </div>
            <div className='review_content hidden'>
                <div className='quote'>
                "Uploading my book was a breeze, and the feedback from readers has been invaluable. The platform's donation system also helps me stay motivated and continue writing. Highly recommend it to fellow authors!"
                </div>
                <div className='writer'>

                    <div className='pfp'>
                        <Image src="/author-pfp.jpeg" alt="book cover" width={300} height={450}/>
                    </div>
                    <div className='name'>
                        John Smith, Author
                    </div>
                </div>
            </div>
        </div>
    </section>
  );
};

export default Review;