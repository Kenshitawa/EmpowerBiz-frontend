import Link from "next/link";
import { ArrowDownRight, ArrowRight, ArrowUpRight, MoveUpRight, Sparkles } from "lucide-react";
import { listProducts, listShops } from "@/lib/commerce";
import { ProductCard } from "@/components/product-card";

export default async function Home() {
  const [products, shops] = await Promise.all([listProducts(), listShops()]);
  const featured = products.slice(0, 4);
  return (
    <main>
      <section className="hero-wrap">
        <div className="hero-copy">
          <span className="eyebrow"><span className="eyebrow-dot" /> A home for good business</span>
          <h1>Small shops.<br /><em>Big possibility.</em></h1>
          <p className="hero-description">Discover the people behind the products. Shop a little differently, and help independent Kenyan businesses go further.</p>
          <div className="hero-actions"><Link href="/marketplace" className="button-primary">Explore the marketplace <ArrowRight size={17} /></Link><Link href="/login" className="text-link">Make room for your business <MoveUpRight size={15} /></Link></div>
          <div className="hero-proof"><div className="avatar-stack"><span>M</span><span>S</span><span>K</span><b>+</b></div><span>Independent makers, all in one place</span></div>
        </div>
        <div className="hero-art" aria-label="A handwoven basket and Kenyan tea from independent shops">
          <div className="hero-blob" />
          <div className="hero-sun" />
          <div className="hero-card hero-card-top"><span className="mini-art mini-basket" /><span><small>MADE IN KENYA</small><strong>Everyday, made better.</strong></span><ArrowUpRight size={16} /></div>
          <div className="hero-product hero-basket"><span className="basket-handle" /><span className="basket-weave" /><span className="basket-stripe" /></div>
          <div className="hero-product hero-tea"><span className="tea-label"><small>KIJANI PANTRY</small><strong>Highland<br />black tea</strong><i>KER&nbsp; ICHO</i></span></div>
          <div className="hero-card hero-card-bottom"><span className="mini-stamp"><Sparkles size={15} /></span><span><small>THOUGHTFULLY SOURCED</small><strong>Good stories, good things.</strong></span></div>
          <div className="hero-caption"><span>01 / 03</span><span>Shop the things that mean more <ArrowDownRight size={14} /></span></div>
          <span className="hero-side-note">A GOOD PLACE TO FIND YOUR NEXT FAVOURITE</span>
        </div>
        <div className="hero-index"><span>01</span><i /></div>
      </section>
      <section className="trust-strip"><span><i>✳</i> Discover independent Kenyan businesses</span><span><i>✳</i> Thoughtful finds for everyday life</span><span><i>✳</i> Shop local, grow together</span></section>
      <section className="section-block featured-section">
        <div className="section-heading"><div><span className="eyebrow">THE GOOD FINDS</span><h2>Worth a closer look<span className="heading-period">.</span></h2><p>Useful, lovely, and made with a little more care.</p></div><Link href="/marketplace" className="section-link">Browse everything <ArrowUpRight size={16} /></Link></div>
        <div className="product-grid">{featured.map((product, index) => <ProductCard key={product.id} product={product} index={index} />)}</div>
      </section>
      <section className="section-block shop-section">
        <div className="section-heading"><div><span className="eyebrow">PEOPLE MAKE THE PLACE</span><h2>Meet the shopkeepers<span className="heading-period">.</span></h2><p>Every shop has a point of view, and a person behind it.</p></div><Link href="/shops" className="section-link">All independent shops <ArrowUpRight size={16} /></Link></div>
        <div className="shop-grid">{shops.map((shop, index) => <Link href={"/shops/" + shop.slug} key={shop.id} className={"shop-tile shop-tile-" + index} style={{ "--shop-accent": shop.accent_color } as React.CSSProperties}><span className="shop-number">0{index + 1}</span><span className="shop-orbit"><span /></span><span className="shop-info"><small>{shop.category} · {shop.product_count} FINDS</small><strong>{shop.name}</strong><span>{shop.description}</span></span><span className="shop-arrow"><ArrowUpRight size={19} /></span></Link>)}</div>
      </section>
      <section className="seller-banner"><div className="seller-mark"><Sparkles size={21} /></div><div><span className="eyebrow">YOUR NEXT CHAPTER STARTS HERE</span><h2>Have a good thing going?</h2><p>Bring your business online, meet new customers, and build a shop that feels like you.</p></div><Link href="/login" className="button-light">Start your shop <ArrowRight size={16} /></Link></section>
      <section className="closing-note"><span>Made of many, made for more.</span><Link href="/marketplace">Find your kind of good <ArrowUpRight size={15} /></Link></section>
    </main>
  );
}
