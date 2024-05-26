import Slide from "./slide";

export default function Header() {
    return (
      <header className="bg-blue-500 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl">اسم المتجر</h1>
          <nav>
            <ul className="flex space-x-4">
              <li>الرئيسية</li>
              <li>المنتجات</li>
              <li>عنا</li>
            </ul>
          </nav>
   
        </div>
        
      </header>
    );
  }
  