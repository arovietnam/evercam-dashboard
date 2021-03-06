require 'ipaddr'
require 'resolv'
class CameraEndpoint < Sequel::Model
  LOCAL_RANGES = [
    IPAddr.new('127.0.0.0/8')
  ]
  PRIVATE_RANGES = [
    IPAddr.new('192.168.0.0/16'),
    IPAddr.new('172.16.0.0/12'),
    IPAddr.new('10.0.0.0/8')
  ]
  many_to_one :camera
  def ipv4
    return host if Resolv::IPv4::Regex =~ host
    addr = Resolv.getaddresses(host).detect { |a| Resolv::IPv4::Regex =~ a }
    addr || (raise Resolv::ResolvError, "no ipv4 address for #{host}")
  end

  def local?
    in_range?(LOCAL_RANGES)
  end

  def private?
    in_range?(PRIVATE_RANGES)
  end

  def public?
    !local? && !private?
  end

  def to_s
    if port == 80
      "#{scheme}://#{host}"
    else
      "#{scheme}://#{host}:#{port}"
    end
  end

  private

  def in_range?(range)
    begin
      range.any? { |r| r.include?(ipv4) }
    rescue
      false
    end
  end
end
